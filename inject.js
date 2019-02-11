// The actual in-browser auto-pause script.

(function () {

    function runAutopause() {
        if (window.AUTO_PAUSING) {
            return;
        }
        window.AUTO_PAUSING = true;
        waitSongEnd().then(() => {
            window.AUTO_PAUSING = false;
            pauseSong();
        });
    }

    function waitSongEnd() {
        return new Promise((resolve, reject) => {
            const initMeta = songMetadata();
            let interval;
            interval = setInterval(() => {
                if (!window.AUTO_PAUSING) {
                    clearInterval(interval);
                    reject('cancelled');
                    return;
                }
                if (songMetadata() != initMeta) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 1000);
        });
    }

    function songMetadata() {
        const title = document.getElementById('currently-playing-title').textContent;
        const details = document.getElementsByClassName('currently-playing-details')[0];
        const detail = details.getElementsByClassName('player-artist')[0].textContent;
        return title + '||||' + detail;
    }

    function pauseSong() {
        document.getElementById('player-bar-play-pause').click();
    }

    runAutopause();

})();
