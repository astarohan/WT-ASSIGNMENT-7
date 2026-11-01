async function submit(e) {
  e.preventDefault();
  setMsg('');
  setErr('');

  const prn = String(form.prn).trim();
  const mobile = String(form.mobile).trim();

  if (!/^\d{12}$/.test(prn)) {
    setErr('PRN must contain exactly 12 digits.');
    return;
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    setErr('Mobile number must contain 10 digits and start with 6, 7, 8, or 9.');
    return;
  }

  try {
    const payload = {
      ...form,
      prn,
      mobile,
      year: Number(form.year)
    };

    const r = await fetch(
      edit ? `${API}/students/${edit}` : `${API}/students`,
      {
        method: edit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const j = await r.json();

    if (!r.ok) {
      throw Error(
        j.errors?.join(' ') ||
        j.message ||
        JSON.stringify(j)
      );
    }

    setMsg(j.message || 'Student saved successfully.');
    setForm(blank);
    setEdit(null);
    setPage(1);
    await load();

  } catch (e) {
    setErr(e.message);
  }
}
