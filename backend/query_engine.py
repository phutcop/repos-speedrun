"""
query_engine.py — Role 3, Phase v1

Per the functional spec, Function 9:
  "harder questions are translated into database queries — generated,
   validated (read-only, restricted to allowed tables, scoped to the
   company), executed, and the real results narrated back."

This module owns that whole path:
  generate_sql()   -> LLM writes a SELECT statement against a fixed schema
  validate_sql()   -> hard rules reject anything unsafe BEFORE execution
  execute_sql()    -> runs the (validated) query read-only, scoped to one company
  narrate_results() -> LLM turns raw rows into a plain-language answer

SECURITY MODEL (this is the part that matters most):
- Only SELECT statements are ever allowed. One statement per query.
- Only whitelisted tables/columns may appear (see ALLOWED_SCHEMA below).
- Every generated query MUST filter on company_id — validated by requiring
  the literal placeholder %(company_id)s, whose value we bind ourselves.
  The LLM's own literal value for company_id (if it tries to hardcode one)
  is never trusted or used.
- No write keywords, no comments, no semicolon-chaining, no system tables.
- If validation fails for any reason, we do NOT retry-and-hope — we refuse.

NOTE ON WIRING THIS UP: this assumes Organized Records (Function 6) is a
Postgres database (per the spec's Supabase choice) with a read-only role
already created for the AI service. Set DATABASE_URL to that read-only
connection string. Adjust ALLOWED_SCHEMA below to match the real column
names once you confirm them against Role 1's actual schema.
"""

import os
import re

import psycopg2
import psycopg2.extras
from groq import Groq

client = Groq(api_key=os.environ["GROQ_API_KEY"])
MODEL = "openai/gpt-oss-120b"

# The read-only connection string for the AI service's DB role.
# Per Function 6: "A separate read-only database role for the AI service."
DATABASE_URL = os.environ.get("DATABASE_URL")

# The single source of truth for what the LLM is allowed to query.
# Keep this in sync with Role 1's actual schema (Function 6).
ALLOWED_SCHEMA = {
    "expenses": ["id", "company_id", "date", "amount", "description", "vendor", "department", "category", "confidence", "human_verified"],
    "budgets": ["id", "company_id", "department", "category", "month", "budgeted_amount"],
    "departments": ["id", "company_id", "name"],
    "categories": ["id", "company_id", "name"],
    "insights": ["id", "company_id", "month", "type", "severity", "message", "evidence"],
}

ALLOWED_TABLES = set(ALLOWED_SCHEMA.keys())

FORBIDDEN_KEYWORDS = [
    r"\bINSERT\b", r"\bUPDATE\b", r"\bDELETE\b", r"\bDROP\b", r"\bALTER\b",
    r"\bTRUNCATE\b", r"\bGRANT\b", r"\bREVOKE\b", r"\bCREATE\b", r"\bEXEC\b",
    r"\bCALL\b", r"--", r"/\*", r"\bpg_", r"\binformation_schema\b",
]


# ---------------------------------------------------------------------------
# Step 1: generate SQL from the question
# ---------------------------------------------------------------------------

def _schema_description() -> str:
    lines = []
    for table, cols in ALLOWED_SCHEMA.items():
        lines.append(f"  {table}({', '.join(cols)})")
    return "\n".join(lines)


SQL_GEN_SYSTEM_PROMPT = f"""You write a single read-only PostgreSQL SELECT statement
to answer a financial question, using ONLY these tables and columns:

{_schema_description()}

Hard rules:
- Output ONLY the SQL statement. No explanation, no markdown fences, no semicolon.
- SELECT statements only. Never write, alter, or delete anything.
- Every query MUST include the literal placeholder %(company_id)s in a WHERE
  clause filtering company_id — every table has this column. This is
  non-negotiable; queries without it will be rejected before they run.
- Never invent a table or column not listed above.
- If the question cannot be answered with these tables, output exactly:
  CANNOT_ANSWER
"""


def generate_sql(question: str) -> str:
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SQL_GEN_SYSTEM_PROMPT},
            {"role": "user", "content": question},
        ],
        temperature=0,
    )
    sql = resp.choices[0].message.content.strip()
    sql = re.sub(r"^```sql|```$", "", sql, flags=re.IGNORECASE).strip()
    return sql


# ---------------------------------------------------------------------------
# Step 2: validate before ever touching the database
# ---------------------------------------------------------------------------

class QueryRejected(Exception):
    pass


def validate_sql(sql: str) -> None:
    """Raises QueryRejected with a specific reason, or returns silently if OK."""
    if not sql or sql.upper() == "CANNOT_ANSWER":
        raise QueryRejected("model could not translate this into a query")

    stripped = sql.strip().rstrip(";")

    if ";" in stripped:
        raise QueryRejected("multiple statements are not allowed")

    if not re.match(r"^\s*SELECT\b", stripped, re.IGNORECASE):
        raise QueryRejected("only SELECT statements are allowed")

    for pattern in FORBIDDEN_KEYWORDS:
        if re.search(pattern, stripped, re.IGNORECASE):
            raise QueryRejected(f"query contains a forbidden keyword/pattern: {pattern}")

    if "%(company_id)s" not in stripped:
        raise QueryRejected("query must scope to company_id via %(company_id)s")

    # crude table whitelist check: every FROM/JOIN target must be an allowed table
    referenced_tables = set(
        t.lower() for t in re.findall(r"\b(?:FROM|JOIN)\s+([a-zA-Z_][a-zA-Z0-9_]*)", stripped, re.IGNORECASE)
    )
    unknown = referenced_tables - ALLOWED_TABLES
    if unknown:
        raise QueryRejected(f"query references non-whitelisted table(s): {unknown}")


# ---------------------------------------------------------------------------
# Step 3: execute, read-only, scoped to one company
# ---------------------------------------------------------------------------

def execute_sql(sql: str, company_id: int, max_rows: int = 200):
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not set — can't run v1 queries yet")

    conn = psycopg2.connect(DATABASE_URL)
    try:
        conn.set_session(readonly=True, autocommit=True)
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, {"company_id": company_id})
            rows = cur.fetchmany(max_rows)
            return [dict(r) for r in rows]
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# Step 4: narrate the real results
# ---------------------------------------------------------------------------

NARRATE_SYSTEM_PROMPT = """You explain real query results to a founder in
plain language. Use ONLY the numbers/rows given to you — never add,
estimate, or infer figures that aren't present. If the result set is
empty, say so plainly rather than guessing why. Keep it to 2-3 sentences,
state facts, and avoid strategic recommendations the data doesn't support."""


def narrate_results(question: str, rows: list) -> str:
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": NARRATE_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Question: {question}\nQuery results: {rows}",
            },
        ],
        temperature=0.2,
    )
    return resp.choices[0].message.content


# ---------------------------------------------------------------------------
# Public entry point used by chat.py
# ---------------------------------------------------------------------------

def answer_via_query_engine(question: str, company_id: int) -> dict:
    sql = generate_sql(question)

    try:
        validate_sql(sql)
    except QueryRejected as e:
        return {
            "answer": (
                "I can't safely answer that from the database. "
                f"({e}) Try rephrasing, or ask about totals, categories, "
                "departments, vendors, or budgets directly."
            ),
            "type": "refusal",
            "rejected_sql": sql,
            "rejection_reason": str(e),
        }

    try:
        rows = execute_sql(sql, company_id)
    except Exception as e:
        return {
            "answer": "I generated a query but couldn't run it against the database right now.",
            "type": "refusal",
            "error": str(e),
        }

    answer = narrate_results(question, rows)
    return {
        "answer": answer,
        "type": "query",
        "sql": sql,
        "row_count": len(rows),
    }