//FONCTIONS
function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

// VARIABLES


const svgNS = "http://www.w3.org/2000/svg";
const gridCards = document.querySelectorAll('.grid-card');

/*conteneur*/
const menuGridCards = document.createElement('div');
menuGridCards.classList.add('menu-grid-cards');

/*sous conteneur*/
const subMenuGridCards = document.createElement('div');
subMenuGridCards.classList.add('sub-menu-grid-cards');

/*croix*/
const cross = document.createElementNS(svgNS, "svg");
setAttributes(cross, {"class": "cross", "xmlns": "http://www.w3.org/2000/svg", "viewBox": "0 0 13.6 13.6", "width": "13.6", "height": "13.6"});
const path = document.createElementNS(svgNS, "path");
setAttributes(path, {"class": "path", "d": "M 13.6,1.01 12.59,0 6.8,5.79 1.01,0 0,1.01 5.79,6.8 0,12.59 1.01,13.6 6.8,7.81 12.59,13.6 13.6,12.59 7.81,6.8 Z"});
cross.appendChild(path);

/*images*/
const linkPictures = document.createElement('a');
linkPictures.href = '#';
linkPictures.textContent = 'Images';

/*github*/
const linkGithub = document.createElement('a');
linkGithub.target = '_blank';
linkGithub.textContent = 'Github';

/*mettre les éléments à menuGridCards*/
subMenuGridCards.append(cross, linkPictures, linkGithub);
menuGridCards.appendChild(subMenuGridCards);

/*créer le modal des cartes*/
const modal = document.createElement('div');
modal.classList.add('modal-pic-grid-card');
const modalContent = document.createElement('div');
modalContent.classList.add('modal-content-pic-grid-card');
modal.appendChild(modalContent);

/*fermer la carte précedente quand on clique sur la nouvelle*/
let prevCard;
let prevMenuGridCards;

/*quitter les réalisations au click*/
let modalIsOpen = 0;
let modalContentImgs, targetGridCards;
//subMenuGridCards linkPictures linkGithub

/************************************************************************/



/************************************************************/

gridCards.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        /*fermer la carte précédente*/
        if (prevMenuGridCards !== undefined) {
            prevMenuGridCards.replaceWith(prevCard);
        }
        /*variables*/
        targetGridCards = e.target;
        prevCard = this;
        prevMenuGridCards = menuGridCards;
        /*insertion et modification du lien Github*/
        this.parentNode.insertBefore(menuGridCards, this);
        menuGridCards.appendChild(this);
        linkGithub.href = this.href;
        /*open modal*/
        modalContentImgs = [];
        const datasetName = this.dataset.name;
        linkPictures.onclick = (e) => {
            e.preventDefault()
            modalIsOpen = 1;
            menuGridCards.appendChild(modal);
            fetch('site-pictures.json')
            .then (response => response.json())
            .then(data => {
                const arrayLinks = data[datasetName];
                for (let x of arrayLinks) {
                    let img = document.createElement('img');
                    img.src = x;
                    img.alt = 'Image du site : ' + datasetName;
                    modalContent.appendChild(img);
                    modalContentImgs.push(img);
                }
            })
        };
    });
});

window.addEventListener('click', function (e) {
    if (modalIsOpen === 1) {
        for (let img of modalContentImgs) {
            if (e.target !== img) {
                prevMenuGridCards.replaceWith(prevCard);
                modalIsOpen = 0;
                prevMenuGridCards = undefined;
                for (let img of modalContentImgs) {
                    modalContent.removeChild(img);
                }
                menuGridCards.removeChild(modal);
            }
        }
    } else if (prevMenuGridCards !== undefined && e.target !== targetGridCards && e.target !== subMenuGridCards && e.target !== prevMenuGridCards && e.target !== linkPictures && e.target !== linkGithub) {
         prevMenuGridCards.replaceWith(prevCard);
         prevMenuGridCards = undefined;
    }
});