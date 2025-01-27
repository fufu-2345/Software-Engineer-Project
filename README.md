**วิธี install หลัง git clone**  
**1.** change directory to System-Engineer-Project in command prompt  
**2.** type setup  
**3.** wait until done  

---

**start**  
npm start  

---

**port**

- front : 3000  
- back : 5000  

---

git branch -r
git fetch origin
git checkout -b branchName(local) origin/branchName(from origin)

---

for branch in $(git branch --list | grep -v 'main' ); do
    git checkout $branch
    git merge main
done

 
