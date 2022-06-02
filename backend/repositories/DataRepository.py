from .Database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    # TABLE USER
    # -- CHECK USERNAME AND PASSWORD
    @staticmethod
    def check_user_login(name,password):
        sql = 'SELECT userid FROM user WHERE BINARY name = %s AND BINARY password = %s'
        params = [name,password]
        return Database.get_one_row(sql,params)

    # -- CHECK BADGEID 
    @staticmethod
    def check_user_badge_id(badgeid):
        sql = 'SELECT badgeid FROM user WHERE badgeid = %s'
        params = [badgeid]
        return Database.get_one_row(sql,params)

    # -- GET ALL BADGEID
    @staticmethod
    def all_users_badge_id():
        sql = 'SELECT badgeid FROM user'
        return Database.get_rows(sql)

    # -- ADD USER
    @staticmethod
    def add_user(name,password,badgeid):
        sql = 'INSERT INTO user (name,password,badgeid) VALUES (%s,%s,%s)'
        params = [name,password,badgeid]
        return Database.execute_sql(sql,params)

    # -- GET USER BY USERID
    @staticmethod
    def read_username_by_id(userid):
        sql = 'SELECT name FROM user WHERE userid = %s'
        params = [userid]
        return Database.get_one_row(sql,params)

    # TABLE HISTORY
    # -- ADD HISTORY
    @staticmethod
    def add_history(value,deviceid,actionid):
        sql = 'INSERT INTO history (value,deviceid,actionid) VALUES (%s,%s,%s)'
        params = [value,deviceid,actionid]
        return Database.execute_sql(sql,params)

    # -- GET NUMBER OF TIMES OPENED/EMPTIED
    @staticmethod
    def filter_number_of_times_by_time_actionid(day,actionid):
        sql = 'SELECT COUNT(*) AS times FROM history WHERE actionid = %s AND action_datetime BETWEEN (CURRENT_DATE()) AND (CURRENT_DATE() + interval %s DAY)'
        params = [actionid,day]
        data = Database.get_one_row(sql,params)
        amount = data['times']
        return amount
    
    # -- GET AVERAGE VALUE DAY OR WEEK OF WEIGHT AND VOLUME
    @staticmethod
    def filter_average_value_by_time(time):
        if time == 'day':
            sql = 'SELECT actionid, AVG(value) AS average FROM history WHERE actionid IN (9,10) AND DATE(action_datetime) = CURRENT_DATE() GROUP BY actionid'
        elif time == 'week':
            sql = 'SELECT actionid, AVG(value) AS average FROM history WHERE actionid IN (9,10) AND yearweek(action_datetime) = yearweek(now()) GROUP BY actionid'
        return Database.get_rows(sql)

    # -- GET TOTAL VALUE ALL, WEEK, MONTH OF WEIGHT, EMPTIED, OPENED
    @staticmethod
    def filter_total_value_by_time(time):
        if time == 'all':
            sql = 'SELECT actionid, COUNT(*) AS total FROM history WHERE actionid IN (2,22) GROUP BY actionid'
        elif time == 'week':
            sql = 'SELECT actionid, COUNT(*) AS total FROM history WHERE actionid IN (2,22) AND yearweek(action_datetime) = yearweek(now()) GROUP BY actionid'
        elif time == 'month':
            sql = 'SELECT actionid, COUNT(*) AS total FROM history WHERE actionid IN (2,22) AND MONTH(action_datetime) = MONTH(NOW()) AND YEAR(action_datetime) = YEAR(NOW())GROUP BY actionid'
        return Database.get_rows(sql)

    # TABLE LOCATION
    # -- GET NAME, ADDRESS AND COORDINATES
    @staticmethod
    def get_info():
        sql = 'SELECT name,address,coordinates FROM location'
        return Database.get_one_row(sql)
    
    # -- UPDATE NAME, ADDRESS AND COORDINATES
    @staticmethod
    def update_location(address,coords,name):
        sql = 'UPDATE location SET address = %s, coordinates = %s, name = %s'
        params = [address,coords,name]
        return Database.execute_sql(sql,params)
