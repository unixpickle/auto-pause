// The actual in-browser auto-pause script.

(function () {

    function runAutopause() {
        if (window.AUTO_PAUSING) {
            return;
        }
        window.AUTO_PAUSING = true;
        const popup = new Popup();
        waitSongEnd().then(() => {
            popup.cancel();
            pauseSong();
        }).catch((e) => {
            popup.cancel();
        })
    }

    function waitSongEnd() {
        return new Promise((resolve, reject) => {
            let initMeta;
            try {
                initMeta = songMetadata();
            } catch (e) {
                reject(e);
                return;
            }
            let interval;
            interval = setInterval(() => {
                if (!window.AUTO_PAUSING) {
                    clearInterval(interval);
                    reject('cancelled');
                    return;
                }
                let newMeta = null;
                try {
                    newMeta = songMetadata();
                } catch (e) {
                    reject(e);
                    return;
                }
                if (newMeta !== initMeta) {
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

    class Popup {
        constructor() {
            this.element = document.createElement('div');
            const attrs = {
                position: 'fixed',
                right: '30px',
                top: '30px',
                width: '200px',
                textAlign: 'center',
                backgroundColor: 'white',
                fontSize: '18px',
                padding: '10px',
                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
            };
            Object.keys(attrs).forEach((k) => this.element.style[k] = attrs[k]);

            const label = document.createElement('label');
            label.textContent = 'Pausing after song...';
            this.element.appendChild(label);

            this.element.appendChild(document.createElement('br'));

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.marginTop = '10px';
            cancelButton.addEventListener('click', () => this.cancel());
            this.element.appendChild(cancelButton);

            document.body.appendChild(this.element);
        }

        cancel() {
            if (this.element.parentNode) {
                window.AUTO_PAUSING = false;
                document.body.removeChild(this.element);
            }
        }
    }

    runAutopause();

})();
