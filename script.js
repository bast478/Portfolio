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
const menuGridCard = document.createElement('div');
menuGridCard.classList.add('menu-grid-cards');

/*sous conteneur*/
const submenuGridCard = document.createElement('div');
submenuGridCard.classList.add('sub-menu-grid-cards');

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

/*mettre les éléments à menuGridCard*/
submenuGridCard.append(cross, linkPictures, linkGithub);
menuGridCard.appendChild(submenuGridCard);

/*créer le modal des cartes*/
const modal = document.createElement('div');
modal.classList.add('modal-pic-grid-card');
const modalContent = document.createElement('div');
modalContent.classList.add('modal-content-pic-grid-card');
modal.appendChild(modalContent);

/*fermer la carte précedente quand on clique sur la nouvelle*/
let prevCard;
let prevmenuGridCard;

/*quitter les réalisations au click*/
let modalIsOpen = false;
let modalContentImgs = {};
let targetGridCards;
let datasetName;

/************************************************************************/

fetch('site-pictures.json')
.then (response => response.json())
.then(data => {
    gridCards.forEach(item => {
        datasetName = item.dataset.name;
        if (datasetName !== undefined) {
            modalContentImgs[datasetName] = data[datasetName];
        }
    }); 
})

/************************************************************/

gridCards.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        /*fermer la carte précédente*/
        if (prevmenuGridCard !== undefined) {
            prevmenuGridCard.replaceWith(prevCard);
        }
        /*variables*/
        targetGridCards = e.target;
        prevCard = this;
        prevmenuGridCard = menuGridCard;
        datasetName = this.dataset.name;
        /*insertion et modification du lien Github*/
        this.parentNode.insertBefore(menuGridCard, this);
        menuGridCard.appendChild(this);
        linkGithub.href = this.href;
        /*open modal*/
        linkPictures.onclick = (e) => {
            e.preventDefault()
            if (datasetName !== undefined) {
                modalIsOpen = true;
                menuGridCard.appendChild(modal);
                for (let x of modalContentImgs[datasetName]) {
                    let img = document.createElement('img');
                    img.src = x;
                    img.alt = 'Image du site : ' + datasetName;
                    modalContent.appendChild(img);
                }
            }
        };
    });
});

window.addEventListener('click', function (e) {
    if (modalIsOpen === true) {
        const imgModalContent = document.querySelectorAll('.modal-content-pic-grid-card img');
        for (let img of imgModalContent) {
            if (e.target !== linkPictures && e.target !== img) {
                prevmenuGridCard.replaceWith(prevCard);
                modalIsOpen = false;
                prevmenuGridCard = undefined;
                for (let img of imgModalContent) {
                    modalContent.removeChild(img);
                }
                menuGridCard.removeChild(modal);
            }
        }
    } else if (prevmenuGridCard !== undefined && e.target !== targetGridCards && e.target !== submenuGridCard && e.target !== prevmenuGridCard && e.target !== linkPictures && e.target !== linkGithub) {
         prevmenuGridCard.replaceWith(prevCard);
         prevmenuGridCard = undefined;
    }
});