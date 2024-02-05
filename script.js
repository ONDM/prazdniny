document.addEventListener('DOMContentLoaded', function()
{
  var dateContainers = document.querySelectorAll('.date-container');
  dateContainers.forEach(function(container)
  {
    var targetDateStr = container.getAttribute('data-target-date');
    var targetDate = new Date(targetDateStr);
    var targetDateElement = container.querySelector('.targetDate');
    var countdownElement = container.querySelector('.countdown');
    if (targetDateElement && countdownElement)
    {
      targetDateElement.textContent = formatDate(targetDate);
      updateCountdown(targetDate, countdownElement, container);
    }
    else
    {
      console.error('Invalid structure for date container:', container);
    }
  });

  function updateCountdown(targetDate, countdownElement, container)
  {
    setInterval(function()
    {
      var currentDate = new Date();
      var timeDifference = targetDate - currentDate;
      if (timeDifference > 0)
      {
        var days = Math.ceil(timeDifference / (24 * 60 * 60 * 1000)); // Zaokrouhlit nahoru
        days = Math.max(0, days); // Nastavit minimální hodnotu na 0
        var remainingText = "Zbýv";
        if (days === 1)
        {
          remainingText += "á 1 den";
        }
        else if (days > 1 && days < 5)
        {
          remainingText += "ají " + days + " dny";
        }
        else
        {
          remainingText += "á " + days + " dnů";
        }
        if (days === 0)
        {
          var hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
          remainingText = "Zbývá " + hours + " hodin";
        }
        countdownElement.innerHTML = remainingText;
      }
      else
      {
        container.remove(); // Smazat kontejner, když čas vyprší
      }
    }, 1000);
  }

  function formatDate(date)
  {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Měsíce jsou indexované od 0
    var year = date.getFullYear();
    return day + '. ' + month + '. ' + year;
  }
});

function showInfo(element)
{
  var infoTitle = element.getAttribute('data-info-title') || 'Podrobnosti';
  var infoDate = element.getAttribute('data-target-date');
  var infoContent = element.getAttribute('data-info').replace(/\\n/g, '\n');

  // Aktualizace názvu a začátku události v kalendáři
  var calendarTitle = infoTitle || 'Název Události';
  var calendarStartDate = infoDate || new Date();
  document.getElementById('info-title').innerText = infoTitle;
  document.getElementById('info-content').innerText = infoContent;

  // Odstranění existujícího tlačítka (duplikování)
  var existingButton = document.getElementById('calbut');
  if (existingButton)
  {
    existingButton.remove();
  }
  // Vytvoření nového tlačítka pro kalendář
  var addToCalendarButton = document.createElement('button');
  addToCalendarButton.innerText = '📅';
  addToCalendarButton.title = 'Přidat do google kalendáře \n!Konečné datum události a upozornění musí být nastaveno manuálně!';
  addToCalendarButton.addEventListener('click', function()
  {
    addToCalendar(calendarTitle, calendarStartDate);
  });

  addToCalendarButton.id = 'calbut';

  // Přidání nového tlačítka do 'info-overlay'
  var infoOverlay = document.getElementById('info-overlay');
  infoOverlay.insertBefore(addToCalendarButton, infoOverlay.firstChild);

  // Zobrazení 'info-overlay'
  document.getElementById('info-overlay').style.display = 'flex';
}

function hideInfo()
{
  document.getElementById('info-overlay').style.display = 'none';
}


function addToCalendar(title, startDate)
{
  var startDateTime = new Date(startDate);

  // Získání aktuálního datumu
  var currentDate = new Date();

  // Nastavení konce události na aktuální datum
  var endDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

  // Vytvořit URL pro otevření kalendáře s předvyplněnými informacemi o události
  var calendarURL = 'https://www.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(title) +
    '&dates=' + encodeURIComponent(formatGoogleCalendarDate(startDateTime, true)) +
    '/' + encodeURIComponent(formatGoogleCalendarDate(endDateTime, false)) +
    '&details=' + encodeURIComponent('') +
    '&remind=0';

  // Otevřít nové okno pro vytvoření události v kalendáři
  var googleCalendarWindow = window.open(calendarURL, '_blank');

  // Přidat event listener pro detekci, kdy se okno zavře
  if (googleCalendarWindow)
  {
    googleCalendarWindow.addEventListener('beforeunload', function()
    {
      console.log('Google Kalendář byl zavřen.');
    });
  }
}

function formatGoogleCalendarDate(date, isStart)
{
  var year = date.getFullYear();
  var month = padZero(date.getMonth() + 1);
  var day = padZero(date.getDate());
  var hours = isStart ? '00' : '23';
  var minutes = isStart ? '00' : '59';

  // Ofset pro střední evropský čas (CET nebo CEST)
  var offsetHours = isStart ? 1 : 2;
  var offsetSign = '+';
  var offsetHoursFormatted = padZero(offsetHours);

  return year + month + day + 'T' + hours + minutes + '00H' + offsetSign + offsetHoursFormatted + '00';
}

function padZero(number)
{
  return number < 10 ? '0' + number : number;
}


// PADÁNÍ VLOČEK
document.addEventListener("DOMContentLoaded", function ()
{
  const snowflakesContainer = document.getElementById("snowflakes-container");
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 11, 10);    // datum se indexuje od 0 po 11, takže 0 = leden a 11 = prosinec
  const endDate = new Date(currentDate.getFullYear(), 0, 1);    // datum se indexuje od 0 po 11, takže 0 = leden a 11 = prosinec

  if (currentDate >= startDate && currentDate < endDate)
  {
    const numberOfSnowflakes = 500;
    const snowflakes = [];

    function random(min, max)
    {
      return Math.random() * (max - min) + min;
    }

    class Snowflake
    {
      constructor()
      {
        this.element = document.createElement("div");
        this.element.className = "snowflake";
        this.element.innerHTML = "*";
        snowflakesContainer.appendChild(this.element);

        this.x = random(0, window.innerWidth);
        this.y = 0;
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
          this.y = 0;
          this.x = random(0, window.innerWidth);
        }

        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.element.style.fontSize = `${this.size}px`;
      }
    }

    function createSnowflake()
    {
      snowflakes.push(new Snowflake());
    }

    function createSnowflakeGroup(groupSize, delay)
    {
      for (let i = 0; i < groupSize; i++)
      {
        setTimeout(createSnowflake, i * delay);
      }
    }

    function moveSnowflakes()
    {
      for (let i = 0; i < snowflakes.length; i++)
      {
        snowflakes[i].update();
      }

      requestAnimationFrame(moveSnowflakes);
    }

    createSnowflakeGroup(numberOfSnowflakes, 200);
    moveSnowflakes();
  }
});
