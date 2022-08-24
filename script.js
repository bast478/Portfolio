//FONCTIONS
function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

// VARIABLES
const svgNS = "http://www.w3.org/2000/svg";
const gridCards = document.querySelectorAll('.grid-card');
/*croix*/
let cross = document.createElementNS(svgNS, "svg");
setAttributes(cross, {"class": "cross", "xmlns": "http://www.w3.org/2000/svg", "viewBox": "0 0 13.6 13.6", "width": "13.6", "height": "13.6"});
let path = document.createElementNS(svgNS, "path");
setAttributes(path, {"class": "path", "d": "M 13.6,1.01 12.59,0 6.8,5.79 1.01,0 0,1.01 5.79,6.8 0,12.59 1.01,13.6 6.8,7.81 12.59,13.6 13.6,12.59 7.81,6.8 Z"});
cross.appendChild(path);
/*fermer la carte précedente quand on clique sur la nouvelle*/
let prevCard;
let prevMenuGridCards;
/*quitter les réalisations au click*/
let modalIsOpen = 0;
let modalContentImgs, subMenuGridCards, linkPictures, linkGithub, targetGridCards;

gridCards.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        if (prevMenuGridCards !== undefined) {
            prevMenuGridCards.replaceWith(prevCard);
        }
        prevCard = this;
        // conteneur
        menuGridCards = document.createElement('div');
        prevMenuGridCards = menuGridCards;
        menuGridCards.classList.add('menu-grid-cards');
        this.parentNode.insertBefore(menuGridCards, this);
        menuGridCards.appendChild(this);
        // sous conteneur
        subMenuGridCards = document.createElement('div');
        subMenuGridCards.classList.add('sub-menu-grid-cards');
        // images
        linkPictures = document.createElement('a');
        linkPictures.href = '#';
        linkPictures.textContent = 'Images';
        // github
        linkGithub = document.createElement('a');
        linkGithub.href = this.href;
        linkGithub.target = '_blank';
        linkGithub.textContent = 'Github';
        subMenuGridCards.append(cross, linkPictures, linkGithub);
        menuGridCards.appendChild(subMenuGridCards);
        // open modal
        modalContentImgs = [];

        const modal = document.createElement('div');
        modal.classList.add('modal-pic-grid-card');
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content-pic-grid-card');
        modal.appendChild(modalContent);
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

        // fermer le menu
        //let clickCard = 0;
        //let clickWindow = 0;
        targetGridCards = e.target;
        // cross.addEventListener('click', () => {
        //     console.log("dfd");
        //     menuGridCards.replaceWith(this);
        // });
        // cross.onclick = () => {
        //     menuGridCards.replaceWith(this);
        // };





        // window.onclick = e => {
        //     console.log('window click');
        //     if (modalIsOpen === 1) {
        //         for (let img of modalContentImgs) {
        //             if (e.target !== img) {
        //                 window.onclick = null;
        //                 //clickWindow ++;
        //                 //clickCard ++;
        //                 menuGridCards.replaceWith(this);
        //             }
        //         }
        //     } else if (e.target !== subMenuGridCards && e.target !== menuGridCards && e.target !== linkPictures && e.target !== linkGithub && e.target !== targetGridCards) {
        //         //clickWindow ++;
        //         //clickCard ++;
        //         window.onclick = null;
        //         menuGridCards.replaceWith(this);
        //     }
        // };
    });
});

window.addEventListener('click', function (e) {
    if (modalIsOpen === 1) {
        for (let img of modalContentImgs) {
            if (e.target !== img) {
                prevMenuGridCards.replaceWith(prevCard);
                modalIsOpen = 0;
                prevMenuGridCards = undefined;
            }
        }
    } else if (prevMenuGridCards !== undefined && e.target !== targetGridCards && e.target !== subMenuGridCards && e.target !== prevMenuGridCards && e.target !== linkPictures && e.target !== linkGithub) {
         prevMenuGridCards.replaceWith(prevCard);
         prevMenuGridCards = undefined;
    }
});