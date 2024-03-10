document.getElementById('business-idea-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const ideaDescription = document.getElementById('idea-description').value;
    const targetMarket = document.getElementById('target-market').value;

    fetch('/submit-idea', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ideaDescription, targetMarket }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('market-analysis-results').innerText = data.response;
    })
    .catch(error => console.error('Error:', error));
});
