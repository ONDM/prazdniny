// SEZNAM VŠECH OKRESŮ V ČR PRO VÝBĚR
const VSECHNY_OKRESY = [
  "Blansko", "Brno-město", "Brno-venkov", "Břeclav", "Hodonín", "Vyškov", "Znojmo",
  "Praha 1", "Praha 2", "Praha 3", "Praha 4", "Praha 5", "Praha 6", "Praha 7", "Praha 8", "Praha 9", "Praha 10",
  "Praha-východ", "Praha-západ", "Benešov", "Beroun", "Kladno", "Kolín", "Kutná Hora", "Mělník", "Mladá Boleslav", "Nymburk", "Příbram", "Rakovník",
  "České Budějovice", "Český Krumlov", "Jindřichův Hradec", "Písek", "Prachatice", "Strakonice", "Tábor",
  "Cheb", "Karlovy Vary", "Sokolov", "Děčín", "Chomutov", "Litoměřice", "Louny", "Most", "Teplice", "Ústí nad Labem",
  "Česká Lípa", "Jablonec nad Nisou", "Liberec", "Semily", "Hradec Králové", "Jičín", "Náchod", "Rychnov nad Kněžnou", "Trutnov",
  "Chrudim", "Pardubice", "Svitavy", "Ústí nad Orlicí", "Havlíčkův Brod", "Jihlava", "Pelhřimov", "Třebíč", "Žďár nad Sázavou",
  "Kroměříž", "Uherské Hradiště", "Vsetín", "Zlín", "Jeseník", "Olomouc", "Přerov", "Šumperk", "Prostějov",
  "Bruntál", "Frýdek-Místek", "Karviná", "Nový Jičín", "Opava", "Ostrava-město",
  "Domažlice", "Klatovy", "Plzeň-jih", "Plzeň-město", "Plzeň-sever", "Rokycany", "Tachov"
].sort();

document.addEventListener('DOMContentLoaded', function()
{
  const okresOverlay = document.getElementById('okres-overlay');
  const okresSelect = document.getElementById('okres-select');
  const okresSubmit = document.getElementById('okres-submit');
  const hlavniZmenitBtn = document.getElementById('hlavni-zmenit-okres-btn');

  // Okresy abecedně
  if (okresSelect)
  {
    VSECHNY_OKRESY.forEach(okres =>
      {
      let opt = document.createElement('option');
      opt.value = okres;
      opt.innerHTML = okres;
      okresSelect.appendChild(opt);
    });
  }

  // Funkce pro uložení vybraného okresu a restart seznamu
  if (okresSubmit)
  {
    okresSubmit.onclick = function()
    {
      localStorage.setItem('vybranyOkres', okresSelect.value);
      if (okresOverlay) okresOverlay.style.display = 'none';
      nacistPrazdniny(); 
    };
  }

  // Zavírání okresního okna kliknutím mimo tabulku
  if (okresOverlay)
  {
    okresOverlay.onclick = function(event)
    {
      if (event.target === okresOverlay)
      {
        // Pokud uživatel už má v paměti nějaký okres uložený (např. mění okres z hlavní stránky), 
        // dovolí se mu okno zavřít. Pokud je tu poprvé (Local Storage je prázdný), ignoruje se.
        if (localStorage.getItem('vybranyOkres'))
        {
          okresOverlay.style.display = 'none';
        }
      }
    };
  }

  if (hlavniZmenitBtn)
  {
    hlavniZmenitBtn.onclick = function()
    {
      if (okresSelect)
      {
        okresSelect.value = localStorage.getItem('vybranyOkres') || "Praha 1";
      }
      if (okresOverlay) okresOverlay.style.display = 'flex';
    };
  }

  // Kontrola, zda už má uživatel vybraný okres v paměti prohlížeče
  let ulozenyOkres = localStorage.getItem('vybranyOkres');

  if (!ulozenyOkres && okresOverlay)
  {
    okresOverlay.style.display = 'flex';
  } else
  {
    nacistPrazdniny();
  }

  function nacistPrazdniny()
  {
    let mujOkres = localStorage.getItem('vybranyOkres') || "Praha 1";

    const aktualniOkresText = document.getElementById('aktualni-okres-text');
    if (aktualniOkresText)
    {
      aktualniOkresText.innerText = `Jarní prázdniny pro okres: ${mujOkres}`;
    }

    const listContainer = document.getElementById('prazdniny-list');
    if (!listContainer) return;

    listContainer.innerHTML = ''; 

    const nadpisElement = document.getElementById('nadpis');
    const currentDate = new Date();

    const konecRoku2526 = new Date('2026-08-31T23:59:59');
    const konecRoku2627 = new Date('2027-08-31T23:59:59');

    if (nadpisElement)
    {
      if (currentDate <= konecRoku2526)
      {
        nadpisElement.innerText = "Prázdniny 2025/2026";
      } else if (currentDate > konecRoku2526 && currentDate <= konecRoku2627)
      {
        nadpisElement.innerText = "Prázdniny 2026/2027";
      } else
      {
        nadpisElement.innerText = "Prázdniny 2027/2028";
      }
    }

    fetch('/prazdniny/prazdniny-list.json')
      .then(response => response.json())
      .then(holidays =>
        {
        holidays.sort((a, b) =>
          {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const endA = a.dateEnd ? new Date(a.dateEnd) : new Date(a.date);
          const endB = b.dateEnd ? new Date(b.dateEnd) : new Date(b.date);
          const dnes = new Date();

          dnes.setHours(0,0,0,0);
          dateA.setHours(0,0,0,0);
          dateB.setHours(0,0,0,0);
          endA.setHours(23,59,59,999);
          endB.setHours(23,59,59,999);

          const probihaA = (dnes >= dateA && dnes <= endA);
          const probihaB = (dnes >= dateB && dnes <= endB);

          if (probihaA && !probihaB) return -1;
          if (!probihaA && probihaB) return 1;

          return dateA - dateB;
        });

        holidays.forEach(holiday =>
          {
          var startDate = new Date(holiday.date);
          var endDate = holiday.dateEnd ? new Date(holiday.dateEnd) : new Date(holiday.date);

          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);

          if (endDate < currentDate) return; 

          if (currentDate <= konecRoku2526)
          {
            if (startDate > konecRoku2526) return;
          } else if (currentDate > konecRoku2526 && currentDate <= konecRoku2627)
          {
            if (startDate <= konecRoku2526 || startDate > konecRoku2627) return;
          } else
          {
            if (startDate <= konecRoku2627) return;
          }

          if (holiday.type === 'jarni')
          {
            if (!holiday.okresy || !holiday.okresy.includes(mujOkres))
            {
              return;
            }
          }

          var container = document.createElement('div');
          container.className = 'date-container';
          container.setAttribute('data-target-date', holiday.date);
          container.setAttribute('data-end-date', holiday.dateEnd ? holiday.dateEnd : holiday.date);
          container.setAttribute('data-info-title', holiday.title);

          let infoText = holiday.info;
          if (holiday.type === 'jarni')
          {
            infoText += `\n\nZobrazeno pro okres: ${mujOkres}`;
          }
          container.setAttribute('data-info', infoText);
          container.setAttribute('data-type', holiday.type || 'ostatni');
          container.onclick = function() { showInfo(this); };

          container.innerHTML = `
            <div class="targetDate">${formatDate(new Date(holiday.date))}</div>
            <div class="countdown"></div>
          `;

          listContainer.appendChild(container);

          var countdownElement = container.querySelector('.countdown');
          updateCountdown(startDate, endDate, countdownElement, container);
        });
      }
    )
    .catch(error => console.error('Chyba při stahování prázdnin z JSON:', error));
  }

  window.resetPrazdniny = nacistPrazdniny;

  function updateCountdown(startDate, endDate, countdownElement, container)
  {
    function checkTime()
    {
      var currentDate = new Date();

      if (currentDate >= startDate && currentDate <= endDate)
      {
        container.classList.add('active-holiday');

        var timeDifferenceEnd = endDate - currentDate;
        var daysEnd = Math.ceil(timeDifferenceEnd / (24 * 60 * 60 * 1000));
        daysEnd = Math.max(0, daysEnd);

        var remainingEndText = "";
        if (daysEnd === 1) { remainingEndText = " (zbývá posledním dnem)"; }
        else if (daysEnd > 1 && daysEnd < 5) { remainingEndText = ` (zbývají ${daysEnd} dny)`; }
        else { remainingEndText = ` (zbývá ${daysEnd} dnů)`; }

        if (daysEnd === 0 || timeDifferenceEnd < (24 * 60 * 60 * 1000)) {
          var hoursEnd = Math.floor((timeDifferenceEnd % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
          if (hoursEnd === 0) { remainingEndText = " (končí za méně než hodinu)"; }
          else if (hoursEnd === 1) { remainingEndText = " (končí za 1 hodinu)"; }
          else if (hoursEnd > 1 && hoursEnd < 5) { remainingEndText = ` (končí za ${hoursEnd} hodiny)`; }
          else { remainingEndText = ` (končí za ${hoursEnd} hodin)`; }
        }
        countdownElement.innerHTML = `<span style='color: #359455; font-weight: bold;'>Probíhá${remainingEndText}</span>`;
      }
      else if (currentDate < startDate)
      {
        container.classList.remove('active-holiday');
        var timeDifference = startDate - currentDate;
        var days = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));
        days = Math.max(0, days);

        var remainingText = "Zbýv";
        if (days === 1) { remainingText += "á 1 den"; }
        else if (days > 1 && days < 5) { remainingText += "ají " + days + " dny"; }
        else { remainingText += "á " + days + " dnů"; }

        if (days === 0)
        {
          var hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
          remainingText = "Zbývá " + hours + " hodin";
        }
        countdownElement.innerHTML = remainingText;
      }
      else
      {
        container.remove();
        clearInterval(interval);
      }
    }
    checkTime();
    var interval = setInterval(checkTime, 1000);
  }

  function formatDate(date)
  {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return day + '. ' + month + '. ' + year;
  }
});

// Zobrazení detailu o prázdninách
function showInfo(element)
{
  var infoTitle = element.getAttribute('data-info-title') || 'Podrobnosti';
  var infoDate = element.getAttribute('data-target-date');
  var infoDateEnd = element.getAttribute('data-end-date') || infoDate;
  var infoContent = element.getAttribute('data-info').replace(/\\n/g, '\n');

  var calendarTitle = infoTitle || 'Název Události';
  var calendarStartDate = infoDate;
  var calendarEndDate = infoDateEnd;

  document.getElementById('info-title').innerText = infoTitle;
  document.getElementById('info-content').innerHTML = infoContent.replace(/\n/g, '<br>');

  var existingButton = document.getElementById('calbut');
  if (existingButton) existingButton.remove();

  var addToCalendarButton = document.createElement('button');
  addToCalendarButton.innerText = '📅';
  addToCalendarButton.title = 'Přidat do Google kalendáře';
  addToCalendarButton.addEventListener('click', function()
  {
    addToCalendar(calendarTitle, calendarStartDate, calendarEndDate);
  });
  addToCalendarButton.id = 'calbut';

  var infoOverlay = document.getElementById('info-overlay');
  if (infoOverlay)
  {
    infoOverlay.insertBefore(addToCalendarButton, infoOverlay.firstChild);
  }

  if (infoOverlay) infoOverlay.style.display = 'flex';

  if (infoOverlay)
  {
    infoOverlay.onclick = function(event)
    {
      if (event.target === infoOverlay)
      {
        hideInfo();
      }
    };
  }
}

function hideInfo()
{
  var infoOverlay = document.getElementById('info-overlay');
  if (infoOverlay) infoOverlay.style.display = 'none';
}

function addToCalendar(title, startDate, endDate)
{
  var startDateTime = new Date(startDate);
  var endDateTime = new Date(endDate);
  endDateTime.setDate(endDateTime.getDate() + 1);

  var calendarURL = 'https://www.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(title) +
    '&dates=' + encodeURIComponent(formatGoogleCalendarDate(startDateTime)) +
    '/' + encodeURIComponent(formatGoogleCalendarDate(endDateTime)) +
    '&details=' + encodeURIComponent('') +
    '&remind=0';

  window.open(calendarURL, '_blank');
}

function formatGoogleCalendarDate(date)
{
  var year = date.getFullYear();
  var month = padZero(date.getMonth() + 1);
  var day = padZero(date.getDate());
  return year + month + day;
}

function padZero(number) { return number < 10 ? '0' + number : number; }

// SW
if ('serviceWorker' in navigator)
{
  navigator.serviceWorker.register('/prazdniny/sw.js').then(() =>
    {
    console.log('Service Worker úspěšně spuštěn. Offline režim aktivován.');
  }).catch(error => console.log('Registrace Service Workera selhala:', error));
}

// Vločky
document.addEventListener("DOMContentLoaded", function ()
{
  const snowflakesContainer = document.getElementById("snowflakes-container");
  if (!snowflakesContainer) return;

  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 11, 10);
  const endDate = new Date(currentDate.getFullYear() + 1, 0, 5);

  if (currentDate >= startDate && currentDate < endDate)
  {
    const numberOfSnowflakes = 200;
    const snowflakes = [];

    function random(min, max) { return Math.random() * (max - min) + min; }

    class Snowflake
    {
      constructor()
      {
        this.element = document.createElement("div");
        this.element.className = "snowflake";
        this.element.innerHTML = "*";
        snowflakesContainer.appendChild(this.element);

        this.x = random(0, window.innerWidth);
        this.y = random(-window.innerHeight, 0);
        this.size = random(5, 18);
        this.speedX = random(-0.5, 0.5);
        this.speedY = random(0.5, 1.5);
      }

      update()
      {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y > window.innerHeight)
        {
          this.y = -10;
          this.x = random(0, window.innerWidth);
        }

        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.element.style.fontSize = `${this.size}px`;
      }
    }

    for (let i = 0; i < numberOfSnowflakes; i++)
    {
      snowflakes.push(new Snowflake());
    }

    function moveSnowflakes()
    {
      for (let i = 0; i < snowflakes.length; i++)
      {
        snowflakes[i].update();
      }
      requestAnimationFrame(moveSnowflakes);
    }

    moveSnowflakes();
  }
});
