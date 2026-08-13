from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict
from .models import FormStatus, QuestionType

class QuestionOptionBase(BaseModel):
    label: str
    order_index: int

class QuestionOptionCreate(QuestionOptionBase):
    pass

class QuestionOptionOut(QuestionOptionBase):
    id: int
    question_id: int
    model_config = ConfigDict(from_attributes=True)

class QuestionBase(BaseModel):
    type: QuestionType
    title: str
    description: Optional[str] = None
    required: bool = False
    order_index: int = 0
    validation_rules: Optional[Any] = None

class QuestionCreate(QuestionBase):
    options: Optional[List[QuestionOptionCreate]] = None

class QuestionUpdate(BaseModel):
    type: Optional[QuestionType] = None
    title: Optional[str] = None
    description: Optional[str] = None
    required: Optional[bool] = None
    order_index: Optional[int] = None
    validation_rules: Optional[Any] = None
    options: Optional[List[QuestionOptionCreate]] = None

class QuestionOut(QuestionBase):
    id: int
    form_id: int
    created_at: datetime
    options: List[QuestionOptionOut] = []
    model_config = ConfigDict(from_attributes=True)

class QuestionReorderInput(BaseModel):
    question_ids: List[int]

class WorkspaceBase(BaseModel):
    name: str

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceOut(WorkspaceBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class FormBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: FormStatus = FormStatus.DRAFT
    share_slug: Optional[str] = None
    theme_settings: Optional[Any] = None
    thank_you_message: Optional[str] = None
    workspace_id: int

class FormCreate(FormBase):
    pass

class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[FormStatus] = None
    theme_settings: Optional[Any] = None
    thank_you_message: Optional[str] = None

class FormOut(FormBase):
    id: int
    created_at: datetime
    updated_at: datetime
    questions: List[QuestionOut] = []
    model_config = ConfigDict(from_attributes=True)

class FormListOut(FormBase):
    id: int
    created_at: datetime
    updated_at: datetime
    response_count: int = 0
    model_config = ConfigDict(from_attributes=True)

class AnswerBase(BaseModel):
    question_id: int
    value: Optional[str] = None

class AnswerCreate(AnswerBase):
    pass

class AnswerOut(AnswerBase):
    id: int
    response_id: int
    model_config = ConfigDict(from_attributes=True)

class ResponseBase(BaseModel):
    completed: bool = False

class ResponseCreate(ResponseBase):
    answers: List[AnswerCreate] = []

class ResponseOut(ResponseBase):
    id: int
    form_id: int
    started_at: datetime
    submitted_at: Optional[datetime] = None
    answers: List[AnswerOut] = []
    model_config = ConfigDict(from_attributes=True)
