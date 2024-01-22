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
        var days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
        var remainingText = "Zbývá ";
        if (days === 1)
        {
          remainingText += "1 den";
        }
        if (days > 1 && days <= 4)
        {
          remainingText += days + " dny";
        }
        else
        {
          remainingText += days + " dnů";
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
        countdownElement.innerHTML = "Vybraný termín již uplynul.";
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

  document.getElementById('info-title').innerText = infoTitle;
  document.getElementById('info-content').innerText = infoContent;
  document.getElementById('info-overlay').style.display = 'flex';
}

function hideInfo()
{
  document.getElementById('info-overlay').style.display = 'none';
}


// PADÁNÍ VLOČEK
document.addEventListener("DOMContentLoaded", function ()
{
  const snowflakesContainer = document.getElementById("snowflakes-container");
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 20);    // datum se indexuje od 0 po 11, takže 0 = leden a 11 = prosinec
  const endDate = new Date(currentDate.getFullYear(), 0, 30);    // datum se indexuje od 0 po 11, takže 0 = leden a 11 = prosinec

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
