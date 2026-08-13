from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
import enum

from .database import Base

class FormStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    CLOSED = "CLOSED"

class QuestionType(str, enum.Enum):
    SHORT_TEXT = "SHORT_TEXT"
    LONG_TEXT = "LONG_TEXT"
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
    EMAIL = "EMAIL"
    NUMBER = "NUMBER"
    DROPDOWN = "DROPDOWN"
    YES_NO = "YES_NO"
    RATING = "RATING"

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    forms = relationship("Form", back_populates="workspace", cascade="all, delete-orphan")

class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(Enum(FormStatus), default=FormStatus.DRAFT)
    share_slug = Column(String, unique=True, index=True)
    theme_settings = Column(JSON, nullable=True)
    thank_you_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="forms")
    questions = relationship("Question", back_populates="form", cascade="all, delete-orphan", order_by="Question.order_index")
    responses = relationship("Response", back_populates="form", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum(QuestionType), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    required = Column(Boolean, default=False)
    order_index = Column(Integer, nullable=False, default=0)
    validation_rules = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    form = relationship("Form", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOption.order_index")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")

class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    label = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False, default=0)

    question = relationship("Question", back_populates="options")

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    completed = Column(Boolean, default=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)

    form = relationship("Form", back_populates="responses")
    answers = relationship("Answer", back_populates="response", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("responses.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    value = Column(String, nullable=True)

    response = relationship("Response", back_populates="answers")
    question = relationship("Question", back_populates="answers")
