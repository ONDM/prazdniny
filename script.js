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
