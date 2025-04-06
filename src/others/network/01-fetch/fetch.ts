async function loadHeroes() {
  const res = await fetch('https://study.duyiedu.com/api/herolist')
  const body = await res.json()
  console.log(body)
}
loadHeroes()

