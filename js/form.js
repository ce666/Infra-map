function addAzims(azims, map) {
  let i = 1;
  for (const azimuth of azims) {
    const cPoint = [azimuth.lat, azimuth.lon];
    createAzim(
      i,
      new Date(azimuth.time).toLocaleString(),
      azimuth.deg,
      azimuth.stat,
      azimuth.vel,
      cPoint,
      map
    );
    i++;
  }
}

function createAzim(n, timeVal, azimVal, statVal, speedVal, cPoint, map) {
  const tr = document.createElement("tr");
  const num = document.createElement("td");
  num.textContent = n;
  const checkHolder = document.createElement("td");
  const check = document.createElement("input");
  check.type = "checkbox";
  check.classList.add("check-azim");
  checkHolder.append(check);
  const time = document.createElement("td");
  time.textContent = timeVal;
  const azim = document.createElement("td");
  azim.textContent = azimVal;
  const stat = document.createElement("td");
  stat.textContent = statVal;
  const speed = document.createElement("td");
  speed.textContent = speedVal;

  tr.append(num);
  tr.append(check);
  tr.append(time);
  tr.append(azim);
  tr.append(stat);
  tr.append(speed);
  table.append(tr);

  // изменение состояния чекбокса
  check.addEventListener("change", (e) => {
    e.preventDefault();
    let completed = false;
    completed = check.checked;
    console.log(completed);
    if (completed) {
      drawAzimuth(map, cPoint, azimVal);
      check.checked = true;
    } else {
      // не позволяет снять галочку
      check.checked = true;
    }
  });
}

function clear() {
  const check = document.querySelectorAll(".check-azim");
  for (const item of check) {
    if (item.checked) item.checked = false;
  }
}
