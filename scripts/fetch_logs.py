import subprocess

def run_cmd(remote_command):
    cmd = ['ssh', 'nivi', remote_command]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    out, err = p.communicate()
    return out, err

if __name__ == '__main__':
    out, err = run_cmd('docker logs --tail 40 naya-api')
    print("NAYA-API LOGS:\n", out)
    if err:
        print("STDERR:\n", err)
    
    out2, err2 = run_cmd('docker logs --tail 40 naya-web-app')
    print("\nNAYA-WEB-APP LOGS:\n", out2)
