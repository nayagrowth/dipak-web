import subprocess

def run_remote_sql(sql):
    cmd = ['ssh', 'nivi', 'docker exec -i naya-postgres psql -U naya -d naya_growth']
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    out, err = p.communicate(input=sql)
    return out, err

if __name__ == '__main__':
    sql = '''
    SELECT 
        id, slug, name, "accountId", status, "publicLeadKey", "lifecycleStage", "isDemo", "isInternal", "isTemplate", "domainMismatchPolicy"
    FROM "Project" 
    WHERE id = 'proj_dipak_web_01';
    '''
    out, err = run_remote_sql(sql)
    print("OUTPUT:\n", out)
    if err:
        print("ERROR:\n", err)
