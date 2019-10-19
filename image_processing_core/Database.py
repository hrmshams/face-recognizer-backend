import mysql.connector

class Database:
    __username = "hamid"
    __password = "123"
    __dbname = "facematcher"
    __host = '127.0.0.1'

    __cnx = None

    '''
    types used in sql
    '''
    INTEGER = "INTEGER"
    VARCHAR = "VARCHAR"
    BOOLEAN = "BOOLEAN"
    # TODO complete this!

    def __init__(self):
        pass

    def connect_db(self, username=None, password=None, dbname=None):
        if username is None:
            username = self.__username
        if password is None:
            password = self.__password
        if dbname is None:
            dbname = self.__dbname

        try:
            self.__cnx = mysql.connector.connect(user=username, password=password, host=self.__host,
                                          database=dbname)
            print("PRINT_connected")
        except mysql.connector.Error as err:
            print("PRINT_couldn't connect to database : %s" % self.__dbname)

    def close_db(self):
        self.__cnx.close()

    """
    """
    def create_table(self, table_name, model):
        # creating the query!
        query = "CREATE TABLE " + table_name + " ("

        for i in range(0, len(model)):
            query = query + model[i][0] + " " + model[i][1] + ","

        # removing the last character
        query = query[:-1]

        query += ");"

        # executing the query!
        cursor = self.__cnx.cursor()
        cursor.execute(query)
        cursor.close()

    '''
    values_model = [
    ['username', 'hrm', True],
    ['password', '123', True]
    ]
    note : the third value tells if column is string or not!
    '''
    def insert(self, table_name, values_model):
        query = "INSERT INTO %s (" % table_name

        for i in range(0, len(values_model)):
            query = query + values_model[i][0] + ", "

        query = query[:-2]
        query += ") VALUES ("

        for i in range(0, len(values_model)):

            if values_model[i][2]: # is string
                value = self.string(str(values_model[i][1]))
            else:
                value = str(values_model[i][1])

            query = query + value + ", "

        query = query[:-2]
        query += ");"

        cursor = self.__cnx.cursor()

        try:
            cursor.execute(query)
        except mysql.connector.ProgrammingError as e:
            print("PRINT_Error : sql syntax error!")
            # print(e.with_traceback())
        except Exception as ex:
            print("PRINT_something else happened when executing sql query!")
            # print(ex.with_traceback())

        self.__cnx.commit()
        cursor.close()

    '''
    '''
    def where(self, table_name, condition):
        query = "SELECT * FROM %s " % table_name
        if condition is not None:
            query += "WHERE %s" % condition

        cursor = self.__cnx.cursor()
        cursor.execute(query)

        result = []
        for r in cursor:
            result.append(r)

        return result

        cursor.close()    # TODO :?

    def all(self, table_name):
        query = "SELECT * FROM %s " % table_name

        cursor = self.__cnx.cursor()
        cursor.execute(query)

        result = []
        for r in cursor:
            result.append(r)

        return result

        cursor.close()    # TODO :?

    def update(self, table_name, condition, new_value):
        query = "UPDATE {0} SET {1} WHERE {2};".format(table_name,new_value,condition)
        cursor = self.__cnx.cursor()    

        try:
            result = cursor.execute(query)
            self.__cnx.commit()
            cursor.close()
            return result
        except Exception as e:
            cursor.close()
            print("PRINT_couldn't exec query")
            print("PRINT_"+e.with_traceback())
            return -1


    def delete(self, table_name, condition):
        query = "DELETE FROM {0} WHERE {1};".format(table_name,condition)
        cursor = self.__cnx.cursor()    

        try:
            result = cursor.execute(query)
            self.__cnx.commit()
            cursor.close()
            return result
        except Exception as e:
            cursor.close()
            print("PRINT_couldn't exec query")
            print("PRINT_"+e.with_traceback())
            return -1


    def exec_query(self, query):
        cursor = self.__cnx.cursor()

        try:
            result = cursor.execute(query)
            cursor.close()
            return result
        except Exception as e:
            print("PRINT_couldn't exec query")
            print("PRINT_"+e.with_traceback())
            return -1

    # takes the string and then return a string with two " at first and end of that!
    @staticmethod
    def string(str):
        return "'" + str + "'"
