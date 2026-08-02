"""
run_eval.py

Runs eval_questions.json against the real chat pipeline and prints
a pass/fail table plus an overall accuracy number.

Since grading free-text answers exactly is brittle, this does a manual
review pass by default: it prints the model's answer next to the expected
answer so you eyeball and count correct ones. That eyeballed number is
what you report as "accuracy" in the spec's evaluation suite requirement.

Run: python3 run_eval.py
Requires: GROQ_API_KEY set in environment
"""

import json
from pathlib import Path

from chat import answer_question

EVAL_PATH = Path(__file__).parent / "eval_questions.json"


def run_eval():
    with open(EVAL_PATH) as f:
        cases = json.load(f)

    print(f"Running {len(cases)} eval questions...\n")
    for i, case in enumerate(cases, 1):
        result = answer_question(case["question"])
        print(f"[{i}] Q: {case['question']}")
        print(f"    Expected type: {case['type']} | Got type: {result['type']}")
        print(f"    Expected: {case['expected_answer']}")
        print(f"    Model said: {result['answer']}")
        print()

    print(
        "Manually mark each as correct/incorrect above, then compute:\n"
        "  accuracy = correct / total\n"
        "Report that number in your README as the published accuracy score."
    )


if __name__ == "__main__":
    run_eval()