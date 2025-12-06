#!/usr/bin/env python3
import os
import platform
import subprocess
from datetime import datetime

BANNER = r"""
 __          __   _  ______  _____   ____   ____  
 \ \        / /  | |/ / __ \|  __ \ / __ \ / __ \ 
  \ \  /\  / /__ | ' / |  | | |__) | |  | | |  | |
   \ \/  \/ / _ \|  <| |  | |  _  /| |  | | |  | |
    \  /\  / (_) | . \ |__| | | \ \| |__| | |__| |
     \/  \/ \___/|_|\_\____/|_|  \_\\____/ \____/ 

             W O L F   O S   ·   O P E R A T O R   C O N S O L E
"""

def clear():
    os.system("clear" if os.name != "nt" else "cls")

def system_info():
    return f"""
System:   {platform.system()} {platform.release()}
Node:     {platform.node()}
Kernel:   {platform.version().split(' ')[0]}
Python:   {platform.python_version()}
Time:     {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""

def list_wolf_root():
    print("\n[WOLF_OS] Files in current directory:\n")
    for entry in os.listdir("."):
        print("  -", entry)

def disk_usage():
    print("\n[WOLF_OS] Disk usage for /mnt/x:\n")
    subprocess.run(["df", "-h", "/mnt/x"])

def main():
    while True:
        clear()
        print(BANNER)
        print(system_info())
        print("MAIN MENU")
        print("  1) System status")
        print("  2) List Wolf_OS directory")
        print("  3) Disk usage (/mnt/x)")
        print("  4) Drop to bash shell")
        print("  0) Power off Wolf OS\n")

        choice = input("Select option: ").strip()

        if choice == "1":
            clear()
            print(BANNER)
            print(system_info())
            input("\nPress Enter to return to menu...")
        elif choice == "2":
            clear()
            print(BANNER)
            list_wolf_root()
            input("\nPress Enter to return to menu...")
        elif choice == "3":
            clear()
            print(BANNER)
            disk_usage()
            input("\nPress Enter to return to menu...")
        elif choice == "4":
            print("\n[WOLF_OS] Opening interactive bash shell. Type 'exit' to return.\n")
            subprocess.run(["bash"])
        elif choice == "0":
            print("\n[WOLF_OS] Shutting down. Goodbye, operator.\n")
            break
        else:
            print("\nInvalid option.")
            input("Press Enter to try again...")

if __name__ == "__main__":
    main()
