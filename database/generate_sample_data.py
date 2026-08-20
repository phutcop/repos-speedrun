import os
import random
import datetime
from dateutil.relativedelta import relativedelta

try:
    import psycopg2
    import psycopg2.extras
    HAVE_PSYCOPG2 = True
except ImportError:
    HAVE_PSYCOPG2 = False

# Configuration
COMPANY_NAME = "Demo Startup Inc."
START_DATE = datetime.date(2024, 1, 1)
MONTHS = 24
OUTPUT_FILE = "database/seed.sql"

DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Operations", "Executive"]
CATEGORIES = ["Salaries", "Cloud Services", "Software Subscriptions", "Travel", "Advertising", "Office Supplies", "Legal"]

def generate_data():
    sql_statements = []
    
    # 1. Company
    sql_statements.append(f"INSERT INTO companies (id, name) VALUES (1, '{COMPANY_NAME}') ON CONFLICT DO NOTHING;")
    
    # 2. Departments
    for dept in DEPARTMENTS:
        sql_statements.append(f"INSERT INTO departments (company_id, name) VALUES (1, '{dept}') ON CONFLICT DO NOTHING;")
    
    # 3. Categories
    for cat in CATEGORIES:
        sql_statements.append(f"INSERT INTO categories (company_id, name) VALUES (1, '{cat}') ON CONFLICT DO NOTHING;")

    current_date = START_DATE
    
    # Base amounts for standard expenses
    salaries_base = 50000.0
    cloud_base = 2000.0
    
    for m in range(MONTHS):
        month_str = current_date.strftime("%Y-%m")
        
        # --- Budgets ---
        # Engineering Budgets
        sql_statements.append(f"INSERT INTO budgets (company_id, department, category, month, budgeted_amount) VALUES (1, 'Engineering', 'Salaries', '{month_str}', 55000) ON CONFLICT DO NOTHING;")
        sql_statements.append(f"INSERT INTO budgets (company_id, department, category, month, budgeted_amount) VALUES (1, 'Engineering', 'Cloud Services', '{month_str}', 3000) ON CONFLICT DO NOTHING;")
        sql_statements.append(f"INSERT INTO budgets (company_id, department, category, month, budgeted_amount) VALUES (1, 'Engineering', 'Software Subscriptions', '{month_str}', 1000) ON CONFLICT DO NOTHING;")
        
        # Marketing Budgets
        sql_statements.append(f"INSERT INTO budgets (company_id, department, category, month, budgeted_amount) VALUES (1, 'Marketing', 'Advertising', '{month_str}', 15000) ON CONFLICT DO NOTHING;")
        sql_statements.append(f"INSERT INTO budgets (company_id, department, category, month, budgeted_amount) VALUES (1, 'Marketing', 'Software Subscriptions', '{month_str}', 500) ON CONFLICT DO NOTHING;")
        
        # Sales Budgets
        sql_statements.append(f"INSERT INTO budgets (company_id, department, category, month, budgeted_amount) VALUES (1, 'Sales', 'Travel', '{month_str}', 5000) ON CONFLICT DO NOTHING;")
        sql_statements.append(f"INSERT INTO budgets (company_id, department, category, month, budgeted_amount) VALUES (1, 'Sales', 'Salaries', '{month_str}', 40000) ON CONFLICT DO NOTHING;")

        # --- Expenses ---
        
        # Standard Salaries
        eng_salary = round(salaries_base + random.uniform(-1000, 1000), 2)
        sales_salary = round(40000 + random.uniform(-500, 500), 2)
        salary_date = current_date.replace(day=28).strftime("%Y-%m-%d")
        sql_statements.append(f"INSERT INTO expenses (company_id, date, amount, description, vendor, department, category, confidence, human_verified) VALUES (1, '{salary_date}', {eng_salary}, 'Engineering Payroll', 'Gusto', 'Engineering', 'Salaries', 0.99, true);")
        sql_statements.append(f"INSERT INTO expenses (company_id, date, amount, description, vendor, department, category, confidence, human_verified) VALUES (1, '{salary_date}', {sales_salary}, 'Sales Payroll', 'Gusto', 'Sales', 'Salaries', 0.99, true);")

        # Planted Story 1: Runaway Cloud Bill
        # Cloud costs increase by 15% every month
        cloud_cost = round(cloud_base * (1.15 ** m), 2)
        cloud_date = current_date.replace(day=3).strftime("%Y-%m-%d")
        sql_statements.append(f"INSERT INTO expenses (company_id, date, amount, description, vendor, department, category, confidence, human_verified) VALUES (1, '{cloud_date}', {cloud_cost}, 'AWS Monthly Invoice', 'Amazon Web Services', 'Engineering', 'Cloud Services', 0.95, true);")
        
        # Planted Story 2: Budget Breach Streak in Marketing
        # Marketing overspends on Advertising by $2k-$4k consistently starting from month 12
        ad_spend = 13000.0 if m < 12 else round(15000.0 + random.uniform(2000, 4000), 2)
        ad_date = current_date.replace(day=15).strftime("%Y-%m-%d")
        sql_statements.append(f"INSERT INTO expenses (company_id, date, amount, description, vendor, department, category, confidence, human_verified) VALUES (1, '{ad_date}', {ad_spend}, 'Google Ads Campaign', 'Google', 'Marketing', 'Advertising', 0.98, true);")
        
        # Planted Story 3: Unused Subscription
        # A random subscription that no one is cancelling
        sub_date = current_date.replace(day=10).strftime("%Y-%m-%d")
        sql_statements.append(f"INSERT INTO expenses (company_id, date, amount, description, vendor, department, category, confidence, human_verified) VALUES (1, '{sub_date}', 499.00, 'Legacy CRM Monthly', 'OldCRM Corp', 'Sales', 'Software Subscriptions', 0.85, false);")
        
        # Regular Subscriptions
        github_date = current_date.replace(day=1).strftime("%Y-%m-%d")
        sql_statements.append(f"INSERT INTO expenses (company_id, date, amount, description, vendor, department, category, confidence, human_verified) VALUES (1, '{github_date}', 400.00, 'GitHub Enterprise', 'GitHub', 'Engineering', 'Software Subscriptions', 0.99, true);")
        
        # Random Travel Expenses
        num_travels = random.randint(1, 4)
        for i in range(num_travels):
            travel_date = current_date.replace(day=random.randint(1, 25)).strftime("%Y-%m-%d")
            travel_cost = round(random.uniform(300, 1500), 2)
            sql_statements.append(f"INSERT INTO expenses (company_id, date, amount, description, vendor, department, category, confidence, human_verified) VALUES (1, '{travel_date}', {travel_cost}, 'Flight to Conference', 'Delta Airlines', 'Sales', 'Travel', 0.90, false);")
            
        current_date += relativedelta(months=1)
        
    return sql_statements

def main():
    statements = generate_data()
    
    # Always write to file as backup
    with open(OUTPUT_FILE, "w") as f:
        f.write("-- Generated Database Seed Data\n\n")
        f.write("\n".join(statements))
        
    print(f"✅ Generated {len(statements)} SQL statements and saved to {OUTPUT_FILE}.")

    # Try to execute if DATABASE_URL is set
    db_url = os.environ.get("DATABASE_URL")
    if db_url and HAVE_PSYCOPG2:
        try:
            print(f"Connecting to database at {db_url}...")
            conn = psycopg2.connect(db_url)
            conn.autocommit = True
            with conn.cursor() as cur:
                print("Executing statements...")
                # It's better to read the schema file if it exists, but the user must run schema.sql first.
                for stmt in statements:
                    cur.execute(stmt)
            conn.close()
            print("✅ Successfully populated the database!")
        except Exception as e:
            print(f"❌ Failed to populate database: {e}")
    else:
        print("ℹ️  DATABASE_URL environment variable not set, or psycopg2 not installed.")
        print("   To populate your database automatically, set DATABASE_URL and run this script again.")

if __name__ == "__main__":
    main()
