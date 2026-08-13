import os
import sys
from datetime import datetime, timedelta
import uuid

# Add the backend directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app import models, schemas
from app.crud import create_form, create_question, create_response

def seed_db():
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if we already have forms to prevent duplicate seeding
        existing_forms = db.query(models.Form).count()
        if existing_forms > 0:
            print("Database already seeded. Clearing existing data...")
            db.query(models.Answer).delete()
            db.query(models.Response).delete()
            db.query(models.QuestionOption).delete()
            db.query(models.Question).delete()
            db.query(models.Form).delete()
            db.commit()

        print("Seeding database...")

        # ---------------------------------------------------------
        # FORM 1: Product Feedback Survey
        # ---------------------------------------------------------
        form1_data = schemas.FormCreate(
            title="Product Feedback Survey",
            description="Help us improve our new SaaS product by sharing your thoughts.",
        )
        form1 = create_form(db, form1_data)
        
        # Manually publish to generate share_slug
        form1.status = models.FormStatus.PUBLISHED
        form1.share_slug = "feedback123"
        form1.thank_you_message = "Thanks for your valuable feedback! We appreciate it."
        db.commit()

        # Add Questions
        q1 = schemas.QuestionCreate(
            type=models.QuestionType.SHORT_TEXT,
            title="What is your name?",
            required=True,
            order_index=0
        )
        create_question(db, form1.id, q1)

        q2 = schemas.QuestionCreate(
            type=models.QuestionType.EMAIL,
            title="What is your email address?",
            description="We promise not to spam you.",
            required=True,
            order_index=1
        )
        create_question(db, form1.id, q2)

        q3 = schemas.QuestionCreate(
            type=models.QuestionType.MULTIPLE_CHOICE,
            title="How often do you use our product?",
            required=True,
            order_index=2,
            options=[
                schemas.QuestionOptionCreate(label="Daily", order_index=0),
                schemas.QuestionOptionCreate(label="Weekly", order_index=1),
                schemas.QuestionOptionCreate(label="Monthly", order_index=2),
                schemas.QuestionOptionCreate(label="Rarely", order_index=3)
            ]
        )
        create_question(db, form1.id, q3)

        q4 = schemas.QuestionCreate(
            type=models.QuestionType.NUMBER,
            title="On a scale of 1-10, how likely are you to recommend us?",
            required=True,
            order_index=3
        )
        create_question(db, form1.id, q4)

        q5 = schemas.QuestionCreate(
            type=models.QuestionType.LONG_TEXT,
            title="What features would you like to see next?",
            required=False,
            order_index=4
        )
        create_question(db, form1.id, q5)

        # Add Responses for Form 1
        q_objs = db.query(models.Question).filter(models.Question.form_id == form1.id).order_by(models.Question.order_index).all()
        q_ids = [q.id for q in q_objs]

        responses_form1 = [
            [("John Doe"), ("john@example.com"), ("Daily"), ("9"), ("I'd love a mobile app version.")],
            [("Jane Smith"), ("jane@startup.io"), ("Weekly"), ("8"), ("Better analytics dashboard.")],
            [("Bob Builder"), ("bob@construction.com"), ("Monthly"), ("6"), ("Dark mode is essential.")],
            [("Alice Wonderland"), ("alice@magic.org"), ("Daily"), ("10"), ("It's perfect as is!")]
        ]

        for resp_data in responses_form1:
            answers = []
            for idx, ans_val in enumerate(resp_data):
                if ans_val:
                    answers.append(schemas.AnswerCreate(question_id=q_ids[idx], value=ans_val))
            
            resp = schemas.ResponseCreate(completed=True, answers=answers)
            create_response(db, form1.id, resp)


        # ---------------------------------------------------------
        # FORM 2: Event Registration
        # ---------------------------------------------------------
        form2_data = schemas.FormCreate(
            title="Tech Meetup Registration",
            description="Join us for an evening of networking and tech talks.",
        )
        form2 = create_form(db, form2_data)
        
        form2.status = models.FormStatus.PUBLISHED
        form2.share_slug = "meetup2026"
        form2.thank_you_message = "You're registered! See you there."
        db.commit()

        q1_f2 = schemas.QuestionCreate(
            type=models.QuestionType.SHORT_TEXT,
            title="Full Name",
            required=True,
            order_index=0
        )
        create_question(db, form2.id, q1_f2)

        q2_f2 = schemas.QuestionCreate(
            type=models.QuestionType.MULTIPLE_CHOICE,
            title="What is your primary role?",
            required=True,
            order_index=1,
            options=[
                schemas.QuestionOptionCreate(label="Frontend Developer", order_index=0),
                schemas.QuestionOptionCreate(label="Backend Developer", order_index=1),
                schemas.QuestionOptionCreate(label="Fullstack Developer", order_index=2),
                schemas.QuestionOptionCreate(label="Designer/PM", order_index=3)
            ]
        )
        create_question(db, form2.id, q2_f2)

        q3_f2 = schemas.QuestionCreate(
            type=models.QuestionType.MULTIPLE_CHOICE,
            title="Do you have any dietary restrictions?",
            required=False,
            order_index=2,
            options=[
                schemas.QuestionOptionCreate(label="None", order_index=0),
                schemas.QuestionOptionCreate(label="Vegetarian", order_index=1),
                schemas.QuestionOptionCreate(label="Vegan", order_index=2),
                schemas.QuestionOptionCreate(label="Gluten-Free", order_index=3)
            ]
        )
        create_question(db, form2.id, q3_f2)

        # Add Responses for Form 2
        q_objs_f2 = db.query(models.Question).filter(models.Question.form_id == form2.id).order_by(models.Question.order_index).all()
        q_ids_f2 = [q.id for q in q_objs_f2]

        responses_form2 = [
            [("Sam Developer"), ("Frontend Developer"), ("Vegetarian")],
            [("Alex Backend"), ("Backend Developer"), ("None")],
            [("Taylor Stack"), ("Fullstack Developer"), ("Vegan")],
            [("Jordan Design"), ("Designer/PM"), ("Gluten-Free")],
            [("Casey Coder"), ("Frontend Developer"), ("None")]
        ]

        for resp_data in responses_form2:
            answers = []
            for idx, ans_val in enumerate(resp_data):
                if ans_val:
                    answers.append(schemas.AnswerCreate(question_id=q_ids_f2[idx], value=ans_val))
            
            resp = schemas.ResponseCreate(completed=True, answers=answers)
            create_response(db, form2.id, resp)


        print("Database seeded successfully with 2 forms and multiple responses!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
