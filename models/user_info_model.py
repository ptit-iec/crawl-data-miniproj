from typing import Optional
from beanie import Document, Link

class UserInfo(Document):
    full_name: str
    number_phone: Optional[str] = None
    email: Optional[str] = None
    id_personal: Optional[str] = None
    status: Optional[bool] = True

    class Settings:
        name = "user_info"
