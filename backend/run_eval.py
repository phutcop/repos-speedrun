"""
run_eval.py

Runs eval_questions.json against the real chat pipeline, saves every
result to eval_results.txt, and prompts you to mark each right/wrong at
the end to produce the actual published accuracy number the spec requires.

Run: python3 run_eval.py
Requires: GROQ_API_KEY set in environment (DATABASE_URL not needed —
this eval suite is written to stay answerable within v0's summary pack,
so no question here should escalate to the v1 query engine).
"""

import json
from pathlib import Path

from chat import answer_question

EVAL_PATH = Path(__file__).parent / "eval_questions.json"
RESULTS_PATH = Path(__file__).parent / "eval_results.txt"


def run_eval():
    with open(EVAL_PATH) as f:
        cases = json.load(f)

    lines = [f"Running {len(cases)} eval questions...\n"]
    print(lines[0])

    for i, case in enumerate(cases, 1):
        try:
            result = answer_question(case["question"])
            answer = result.get("answer", "")
            got_type = result.get("type", "?")
        except Exception as e:
            answer = f"[ERROR] {e}"
            got_type = "error"

        block = (
            f"[{i}] Q: {case['question']}\n"
            f"    Expected type: {case['type']} | Got type: {got_type}\n"
            f"    Expected: {case['expected_answer']}\n"
            f"    Model said: {answer}\n"
        )
        print(block)
        lines.append(block)

    footer = (
        "\n--- SCORING ---\n"
        "Go through each [i] above. Mark it correct if 'Model said' matches\n"
        "the substance of 'Expected' (exact wording doesn't need to match,\n"
        "the numbers/facts do). Then:\n"
        f"  accuracy = (# correct) / {len(cases)}\n"
        "Report that percentage as your published eval score.\n"
    )
    print(footer)
    lines.append(footer)

    with open(RESULTS_PATH, "w") as f:
        f.write("\n".join(lines))
    print(f"Full output also saved to {RESULTS_PATH}")


if __name__ == "__main__":
    run_eval()