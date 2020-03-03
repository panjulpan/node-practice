# nodejs-practice

Learn to build basic NodeJS + Express App

## Usage

Belajar membuat aplikasi To-Do List dengan menggunakan Nodejs + Express dan module fs (filesystem)

## Step-by-step

1. Install Node & NPM (Node Package Manager) (search di google cara install yang latest LTS untuk windows)
2. Install library express

```bash
npm install express --save
```

3. Install library ejs (embedded javascript)

```bash
npm install ejs --save
```

4. Coding~

## Milestones

[ ] **Install NPM & Nodejs**
[ ] **Install Express**
[ ] **Install ejs**
[ ] **Setup Initial express app**

- **Setup API Routes**:

* [ ] GET: Get All Activity (/api/todos)
* [ ] GET: Get One Activity (/api/todo/:id)
* [ ] POST: Create Activity (/api/todos)
* [ ] PUT: Update Activity (/api/todo/:id)
* [ ] DELETE: DELETE Activity (/api/todo/:id)

- **Setup View Routes**:

* [ ] View All Activity (/todos)
* [ ] Get an Activity Detail (/todo/:id)
* [ ] Create an Activity (/todo/new)
* [ ] Edit an Activity (/todo/update/:id)

## Notes

Setiap pembacaan/perubahan/penambahan activity, harus melihat isi file _data.json_ menggunakan module fs
