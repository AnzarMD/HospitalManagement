const bcrypt = require("bcryptjs");
const { getDb } = require("./database");

async function seed() {
  const db = await getDb();
  console.log("🌱 Seeding database...");

  db.exec(`
    DELETE FROM users;
    DELETE FROM patients;
    DELETE FROM staff;
    DELETE FROM appointments;
    DELETE FROM inventory;
  `);

  // Users
  const insertUser = db.prepare(
    `INSERT INTO users (username, password, role, name, title, avatar) VALUES (?, ?, ?, ?, ?, ?)`
  );
  insertUser.run("admin", bcrypt.hashSync("admin123", 10), "admin", "Dr. Elena Marsh",  "Hospital Administrator", "EM");
  insertUser.run("staff", bcrypt.hashSync("staff123", 10), "staff", "Nurse James Osei", "Head Nurse – ICU",       "JO");

  // Patients
  const ip = db.prepare(`INSERT INTO patients (id,name,age,gender,ward,doctor,status,admitted,blood_group,phone) VALUES (?,?,?,?,?,?,?,?,?,?)`);
  ip.run("P-001","Aisha Rahman",   34,"Female","Cardiology", "Dr. Smith","Stable",    "2025-02-20","A+","9876543210");
  ip.run("P-002","Carlos Mendez",  67,"Male",  "Neurology",  "Dr. Lee",  "Critical",  "2025-02-22","O-","9123456780");
  ip.run("P-003","Priya Nair",     28,"Female","Orthopedics","Dr. Marsh","Recovering","2025-02-18","B+","9988776655");
  ip.run("P-004","Samuel Kim",     51,"Male",  "Oncology",   "Dr. Patel","Stable",    "2025-02-15","AB+","9871234560");
  ip.run("P-005","Fatima Al-Sayed",42,"Female","ICU",        "Dr. Marsh","Critical",  "2025-02-25","A-","9765432100");

  // Staff
  const is = db.prepare(`INSERT INTO staff (id,name,role,dept,shift,status,joined) VALUES (?,?,?,?,?,?,?)`);
  is.run("S-001","Dr. Elena Marsh", "Administrator", "Admin",    "Morning","Active",   "2018-03-01");
  is.run("S-002","Nurse James Osei","Head Nurse",    "ICU",      "Morning","Active",   "2020-06-15");
  is.run("S-003","Dr. Amir Patel",  "Oncologist",    "Oncology", "Evening","Active",   "2019-11-20");
  is.run("S-004","Dr. Sara Lee",    "Neurologist",   "Neurology","Night",  "On Leave", "2021-01-10");
  is.run("S-005","Tech. Ravi Gupta","Lab Technician","Pathology","Morning","Active",   "2022-07-05");

  // Appointments
  const ia = db.prepare(`INSERT INTO appointments (id,patient,doctor,date,time,type,status) VALUES (?,?,?,?,?,?,?)`);
  ia.run("A-001","Aisha Rahman", "Dr. Smith","2025-03-01","10:00 AM","Follow-up",   "Confirmed");
  ia.run("A-002","Carlos Mendez","Dr. Lee",  "2025-03-02","02:30 PM","Consultation","Pending");
  ia.run("A-003","Priya Nair",   "Dr. Marsh","2025-03-03","11:00 AM","Check-up",    "Confirmed");
  ia.run("A-004","New Patient",  "Dr. Patel","2025-03-04","09:00 AM","First Visit", "Pending");

  // Inventory
  const ii = db.prepare(`INSERT INTO inventory (id,name,category,stock,unit,threshold,supplier) VALUES (?,?,?,?,?,?,?)`);
  ii.run("I-001","Paracetamol 500mg", "Medicine", 450,"Strips", 100,"MedCo");
  ii.run("I-002","Surgical Gloves (L)","PPE",      30, "Boxes",  50, "SafeWear");
  ii.run("I-003","IV Fluid NS 500ml", "IV Fluid", 120,"Bottles",80, "PharmaGen");
  ii.run("I-004","Insulin 100IU",      "Medicine",  15,"Vials",  30, "BioPharm");
  ii.run("I-005","Oxygen Masks",       "Equipment", 65,"Pieces", 40, "MedEquip");

  console.log("✅ Database seeded successfully!");
  db.close();
}

seed().catch(console.error);
