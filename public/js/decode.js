(function () {
    class PageCypher {

        constructor() {
            this.text = ''
            this.words = ''
            this.letters = {}
            this.text = this.getText();
            this.errors = [];

            this.text = this.text.replaceAll(`\n`, ' ');
            this.words = this.text.split(' ');
            this.words.forEach(this.analyzeWord.bind(this));
        }

        getText() {
            return document.querySelector('main').outerText;
        }

        analyzeWord(word, wordIndex) {
            let wordLetters = word.split('');
            wordLetters.forEach(
                ((letter, letterIndex) => {
                    if (!this.letters[letter]) {
                        this.letters[letter] = [];
                    }
                    this.letters[letter].push({ w: wordIndex, l: letterIndex });
                }).bind(this));
        }

        encodeLetter(letter) {
            if (letter === ' ') {
                return ' ';
            }

            if (!this.letters[letter]) {
                this.errors.push(`Could not encode '${letter}' - this does not appear in the text of the page`);
                return letter;
            }

            let possibleCodes = this.letters[letter];
            let randomIndex = Math.floor(Math.random() * possibleCodes.length);
            return possibleCodes[randomIndex];
        }

        decodeLetter(code) {
            if (typeof code === 'string') {
                return code;
            }

            let word = this.words[code.w];
            return word.split('')[code.l];
        }

        codeItem2text(codeItem) {
            if (codeItem === ' ') {
                return "__"
            }

            if (typeof codeItem === 'string') {
                return codeItem;
            }

            return `${codeItem.w}-${codeItem.l}`
        }

        text2CodeItem(text) {
            if (text === '__') {
                return ' '
            }

            if (text.length === 1) {
                return text;
            }

            const [word, letter] = text.split('-')
            return {
                w: word,
                l: letter
            }
        }

        getErrorsContent() {
            if (this.errors.length === 0) {
                return '';
            }

            return '\n\nErrors:\n' + this.errors.join('\n');
        }

        encode() {
            const message = prompt('Enter your message');
            let messageLetters = message.split('');
            const code = messageLetters.map(this.encodeLetter.bind(this));
            console.log(code)

            const codeContent = 'Your code is: ' + code.map(this.codeItem2text).join(',')

            const newDiv = document.createElement('div');
            newDiv.style.padding = '12px'
            newDiv.style.backgroundColor = 'white'
            newDiv.style.color = 'black'
            const newPre = document.createElement('pre');
            newPre.innerText = codeContent + this.getErrorsContent();
            newDiv.appendChild(newPre)

            document.body.prepend(newDiv);
        }

        decode() {
            const message = prompt('Enter your code')
            const codes = message.split(',').map(this.text2CodeItem)
            const decodedContent = codes.map(this.decodeLetter.bind(this)).join('');
            alert('Your message is: ' + decodedContent)
        }
    }

    const pageCypher = new PageCypher();
    pageCypher.decode()
})()
