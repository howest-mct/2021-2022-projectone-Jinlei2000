from .Database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    # USER
    @staticmethod
    def check_user_login(name,password):
        sql = 'SELECT userid FROM user WHERE BINARY name = %s AND BINARY password = %s'
        params = [name,password]
        return Database.get_one_row(sql,params)

    @staticmethod
    def all_users_badge_id():
        sql = 'SELECT badgeid FROM user'
        return Database.get_rows(sql)

    @staticmethod
    def add_user(name,password,badgeid):
        sql = 'INSERT INTO user (name,password,badgeid) VALUES (%s,%s,%s)'
        params = [name,password,badgeid]
        return Database.execute_sql(sql,params)

    @staticmethod
    def read_username_by_id(userid):
        sql = 'SELECT name FROM user WHERE userid = %s'
        params = [userid]
        return Database.get_one_row(sql,params)

    # HISTORY
    @staticmethod
    def add_history(value,deviceid,actionid):
        sql = 'INSERT INTO history (value,deviceid,actionid) VALUES (%s,%s,%s)'
        params = [value,deviceid,actionid]
        return Database.execute_sql(sql,params)
