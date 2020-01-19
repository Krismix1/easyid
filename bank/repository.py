import logging
from models.account import database, Account

def account_by_email(email):
    with database:
        acc = Account.select().where(Account.email == email).get()
        return acc
    return None

def account_exists(email):
    from peewee import DoesNotExist
    try:
        with database:
            exists = Account.select().where(Account.email == email).exists()
            return exists
    except DoesNotExist:
        logging.debug('Account with email %s not found in database', email)
    return False

if __name__=='__main__':
    from peewee import DoesNotExist
    print(account_by_email('a@a.com').amount)
    print(account_by_email('b@a.com').amount)
    try:
        account_by_email('c@a.com')
    except DoesNotExist as e:
        print(type(e))
    print(account_exists('a@a.com'))
    print(account_exists('c@a.com'))