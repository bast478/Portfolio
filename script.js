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

/*Lien images*/
const linkPictures = document.createElement('a');
linkPictures.classList.add('link-pictures');
linkPictures.href = '#';
linkPictures.textContent = 'Description et\nimages';

/*Lien github*/
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

/*texte du modal*/
let contentAllPDescription;
const divModalDescription = document.createElement('div'), pSujetReal = document.createElement('p'), pObjectifReal = document.createElement('p'), pTechnologiesReal = document.createElement('p'), spanSujet = document.createElement('span'), spanObjectif = document.createElement('span'), spanTechno = document.createElement('span');
divModalDescription.classList.add('modal-content-description');
pSujetReal.appendChild(spanSujet);
pObjectifReal.appendChild(spanObjectif);
pTechnologiesReal.appendChild(spanTechno);
divModalDescription.append(pSujetReal, pObjectifReal, pTechnologiesReal);
modalContent.appendChild(divModalDescription);
spanSujet.textContent = 'Sujet';
spanObjectif.textContent = 'Objectif';
spanTechno.textContent = 'Technologies utilisées';

/*remplacer le menu par la carte quand on quitte*/
let prevCard, prevmenuGridCard = null;
/*modal/target/dataset*/
const JSONDescriptions = {}, JSONImgsLinks = {};
let modalIsOpen = false, modalContentImgs = [], targetGridCards, datasetName;

/*img clicked modal*/
let imgClicked = null, imgClickedActive = false;

/************************************************************************/

fetch('site-pictures.json')
.then (response => response.json())
.then(data => {
    gridCards.forEach(item => {
        datasetName = item.dataset.name;
        if (datasetName !== undefined) {
            JSONDescriptions[datasetName] = data[datasetName][datasetName+'-description'];
            JSONImgsLinks[datasetName] = data[datasetName][datasetName+'-links'];
            console.log(JSONImgsLinks);
            console.log(JSONImgsLinks[datasetName]);
        }
    }); 
})

/************************************************************/

gridCards.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
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
                contentAllPDescription = [document.createTextNode(JSONDescriptions[datasetName][0]), document.createTextNode(JSONDescriptions[datasetName][1]), document.createTextNode(JSONDescriptions[datasetName][2])];
                pSujetReal.appendChild(contentAllPDescription[0]);
                pObjectifReal.appendChild(contentAllPDescription[1]);
                pTechnologiesReal.appendChild(contentAllPDescription[2]);
                menuGridCard.appendChild(modal);
                let linksOfPics;
                if (window.innerWidth < 100) {
                    linksOfPics = ['mobile'];
                } else {
                    linksOfPics = ['desktop', 'tablet', 'mobile'];
                }
                for (let i=0; i<linksOfPics.length; i++){
                    for (let x of JSONImgsLinks[datasetName][linksOfPics[i]]) {
                        console.log(x);
                        let img = document.createElement('img');
                        img.src = x;
                        img.alt = 'Image du site : ' + datasetName;
                        modalContent.appendChild(img);
                        modalContentImgs.push(img);
                        img.onclick = e => {
                            if (imgClickedActive === false) {
                                imgClicked = e.target;
                                modal.classList.add('img-clicked');
                                imgClicked.classList.add('img-clicked');
                                imgClickedActive = true;
                            } else {
                                imgClickedActive = false;
                            }
                        };
                    }
                }
            }
        };
    });
});

//Si je clique
window.addEventListener('click', function (e) {
    const eTarget = e.target;
    console.log(eTarget);
    if (imgClickedActive === true && eTarget !== imgClicked) {
        imgClicked.classList.remove('img-clicked');
        modal.classList.remove('img-clicked');
    } else if (modalIsOpen === true && eTarget !== divModalDescription && eTarget !== pSujetReal && eTarget !== pObjectifReal && eTarget !== pTechnologiesReal && eTarget !== spanSujet && eTarget !== spanObjectif && eTarget !== spanTechno) {
        function clickOutsideImg(img) {
            return eTarget !== img;
        }
        let result = modalContentImgs.every(clickOutsideImg);
        if (result) {
            pSujetReal.removeChild(contentAllPDescription[0]);
            pObjectifReal.removeChild(contentAllPDescription[1]);
            pTechnologiesReal.removeChild(contentAllPDescription[2]);
            for (let el of modalContentImgs) {
                modalContent.removeChild(el);
            }
            modalContentImgs = [];
            menuGridCard.removeChild(modal);
            modalIsOpen = false;
        }
    } else if (prevmenuGridCard !== null && eTarget !== targetGridCards && eTarget !== submenuGridCard && eTarget !== prevmenuGridCard && eTarget !== linkPictures && modalIsOpen === false && eTarget !== linkGithub) {
        prevmenuGridCard.replaceWith(prevCard);
        prevmenuGridCard = null;
    }
}, true);