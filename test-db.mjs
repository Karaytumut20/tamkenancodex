async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/admin/mega-menu/dummy", { method: 'GET' });
    // Actually, I can just use the DB getter to read it.
  } catch (err) {
    console.error(err);
  }
}
test();
