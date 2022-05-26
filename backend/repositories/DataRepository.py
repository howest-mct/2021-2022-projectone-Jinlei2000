from .Database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    @staticmethod
    def check_user_login(name,password):
        sql = 'SELECT userid FROM user WHERE name = %s and password = %s'
        params = [name,password]
        return Database.get_one_row(sql,params)

    def all_users_badge_id():
        sql = 'SELECT badgeid FROM user'
        return Database.get_rows(sql)

    def create_user(name,password,badgeid):
        sql = 'INSERT INTO user (name,password,badgeid) VALUES (%s,%s,%s)'
        params = [name,password,badgeid]
        return Database.execute_sql(sql,params)
