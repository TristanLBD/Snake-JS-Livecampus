export class Scoreboard {
    constructor() {
        if(localStorage.getItem('highscores') == null) {
            this.fetchHightscores();
        } else {
            this.scoreboard = JSON.parse(localStorage.getItem('highscores'));
        }
        this.scoreboardList = document.getElementById('highscores-list');
        this.scoreboardForm = document.getElementById('scoreboardForm');
        this.scoreboardInput = document.getElementById('scoreboardInput');
        this.maxScores = 20;

        this.showBestScores();
    }

    async fetchHightscores() {
        try {
            let highscoresArray = [];
            const res = await fetch(`https://randomuser.me/api/?nat=fr&results=20`);
            const data = await res.json();
            data.results.forEach(element => {
                let username = element.login.username;
                let score = (Math.floor(Math.random() * 22) + 1) * 10; // Générer un faux highscore entre 10 ry 220
                highscoresArray.push({ username:username, score:score });
            });
            highscoresArray.sort((a, b) => b.score - a.score);
            this.saveHighscores(highscoresArray);
            this.scoreboard = highscoresArray;
        } catch (err) {
            alert('Une erreur est survenue lors de la récoltes des meilleurs scores.');
            console.error(err);
        }
    }

    checkIfHighScore(score) {
        if(this.scoreboard.length < 1) return false;
        if(score >= this.scoreboard[this.scoreboard.length - 1].score) { return true; }
        return false;
    }

    saveHighscores(highscores) {
        while(highscores.length > 20) { highscores.pop(); }
        localStorage.setItem('highscores', JSON.stringify(highscores));
    }

    showBestScores() {
        let scores = this.scoreboard;
        while (this.scoreboardList.firstChild) {this.scoreboardList.removeChild(this.scoreboardList.firstChild);}
        scores.forEach(element => {
            let listItem = document.createElement('li');
            listItem.innerText = element.username + " : " + element.score;
            this.scoreboardList.appendChild(listItem);
        });
    }


    handleForm(score) {
        this.scoreboardForm.classList.toggle("hidden");
        this.scoreboardForm.onsubmit = (e) => {
            e.preventDefault();
            let username = this.scoreboardInput.value;
            if (username.length >= 6 && username.length <= 20) { this.scoreboardForm.classList.toggle("hidden"); }
            this.addScore(score, username);
            this.showBestScores();
        };
    }

    addScore(score, username) {
        this.scoreboard.push({ username:username, score:score });
        this.scoreboard.sort((a, b) => b.score - a.score);
        this.saveHighscores(this.scoreboard);
    }
}