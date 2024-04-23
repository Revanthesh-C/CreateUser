import {Pool} from 'pg';
const pool = new Pool({
    
        "host": "localhost",
        "user": "postgres",
        "port": 5432,
        "database": "users",
        "password": "postgres",
        "max" : 10
      
})

export var connection_problem :Boolean = false ;
pool.connect(err => {
        if(err)
        return connection_problem = true;
        else
        return connection_problem = false;
})


export default pool;