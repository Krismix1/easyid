from peewee import Model, MySQLDatabase, CharField, FloatField, AutoField

database = MySQLDatabase(
	host='localhost',
	user='root',
	password='secret',
	database='bank'
)

# model definitions -- the standard "pattern" is to define a base model class
# that specifies which database to use. Then, any subclasses will automatically
# use the correct storage.
class BaseModel(Model):

    class Meta:
        database = database


class Account(BaseModel):
    id_ = AutoField(column_name='id', primary_key=True)
    email = CharField(null=False, max_length=32)
    amount = FloatField(null=False)

    class Meta:
        table_name = 'accounts'
