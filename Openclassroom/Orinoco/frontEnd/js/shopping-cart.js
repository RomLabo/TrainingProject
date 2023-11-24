const productsOnLocaleStorage = JSON.parse(localStorage.getItem('viewCartProduct'));
let cartInfo = document.getElementById('cart-info');
(productsOnLocaleStorage == null) || (productsOnLocaleStorage.length === 0) ? cartInfo.style.display = 'flex' : cartInfo.style.display = 'none';
let sumProductsPriceStorage = 0;


// Créer un titre h2 avec la somme total des produits et l'injecte dans le document.
let lengthOfStorage = productsOnLocaleStorage?.length;
let getSumPriceProductStorage = () => {
    let sumPriceProductElement = document.createElement('h2');
    sumPriceProductElement.textContent = "Total : " + (new Intl.NumberFormat("fr-FR", {style: "currency", currency: "EUR"}).format(sumProductsPriceStorage / 1000)); 
    document.getElementById('sumPriceProducts').appendChild(sumPriceProductElement);
}


let buttonToRemoveThisProduct;
// Créer une ligne de tableau avec les différentes valeurs du produits.
const displayProductOfLocalStorage = (product) => {
    const templateElement = document.getElementById("productTemplate")
    const productHtml = document.importNode(templateElement.content, true)

    productHtml.getElementById("refStor").setAttribute('id', product.ref);
    productHtml.getElementById("nameStor").textContent = product.nameProduct;
    productHtml.getElementById("quantityStor").textContent = product.quantity;
    productHtml.getElementById("optionStor").textContent = product.option;
    productHtml.getElementById("priceStor").textContent = (new Intl.NumberFormat("fr-FR", {style: "currency", currency: "EUR"}).format(product.price / 1000));
    productHtml.getElementById("remove-item").setAttribute('id', (product.nameProduct + product.option));
    document.getElementById('tableStor').appendChild(productHtml);

    allButtonToRemoveProduct = document.querySelectorAll(".remove");
    addDeleteProductOption();
}


const addDeleteProductOption = () => {
    let productStorage = JSON.parse(localStorage.getItem("viewCartProduct"))
    for ( let deleteButton = 0; deleteButton < allButtonToRemoveProduct.length; deleteButton++) {
        allButtonToRemoveProduct[deleteButton].addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            attributeOfButtonToRemoveThisProduct = allButtonToRemoveProduct[deleteButton].getAttribute('id');
            removeThisProductInShoppingCart(productStorage);
        })
    }
}


const removeThisProductInShoppingCart = (productStorage) => {
    const indexOfProductToBeRemove = productsOnLocaleStorage.findIndex(product => attributeOfButtonToRemoveThisProduct === (product.nameProduct + product.option));
    delete productStorage[indexOfProductToBeRemove];
    productStorage = productStorage.filter(item => item.value != '')
    localStorage.setItem("viewCartProduct", JSON.stringify(productStorage));
    document.location.reload();
}


let sumOfQuantityProducts = 0;
let counterQuantityDisplay = document.getElementById('count');
let getSumOfQuantityProducts = () => productsOnLocaleStorage.forEach(product => {
    sumOfQuantityProducts += Number(product.quantity);
    counterQuantityDisplay.textContent = sumOfQuantityProducts;
    sumOfQuantityProducts < 100 ? counterQuantityDisplay.style.display = 'flex' : counterQuantityDisplay.style.display = 'none' ;
});


// Pour chaque produit stocké dans le storage, est crée une ligne de tableau et son prix est ajouté au précédent.
const addProductForEachProducts = () => productsOnLocaleStorage.forEach(product => {
    displayProductOfLocalStorage(product);
    sumProductsPriceStorage += product.price;
});


// Fonction pour vider le panier et le local storage.
const removeAllProducstInShoppingCart = () => {
    localStorage.clear();
    document.location.reload();
}


// Ecoute le click du bouton 'vider le panier' .
const buttonToRemoveAllProducts = document.getElementById('remove-products');
buttonToRemoveAllProducts.addEventListener('click', removeAllProducstInShoppingCart);


// variables stockant les inputs du formulaire de contact.
const contactForm = document.getElementById('form');
const purchaseBtn = document.getElementById("purchase-btn");
const userPostCode = document.getElementById("user_postcode");
const userMail = document.getElementById('user_mail');
const userFirstName = document.getElementById('user_first-name');
const userName = document.getElementById('user_name');
const userCity = document.getElementById('user_city');
const userAddress = document.getElementById('user_address');

const userNameValidIcon = document.getElementById('name-valid');
const userFirstNameValidIcon = document.getElementById('first-name-valid');
const userMailValidIcon = document.getElementById('mail-valid');
const userPostCodeValidIcon = document.getElementById('postcode-valid');
const userAddressValidIcon = document.getElementById('address-valid');
const userCityValidIcon = document.getElementById('city-valid');


// Variables pour stocker les regexs de chaque champ du formulaire.
const postCodeRegex = /^((0[1-9])|([1-8][0-9])|(9[0-8]))[0-9]{3}$/;
const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
const firstNameRegex = /^[A-Z][A-Za-z\é\è\ê\ï\-]+$/;
const nameRegex = /^[A-Z][A-Za-z\é\è\ê\ï\-]+$/;
const addressRegex = /^(([a-zA-ZÀ-ÿ0-9]+[\s\-]{1}[a-zA-ZÀ-ÿ0-9]+)){1,10}$/;
const cityRegex = /^[A-Z][A-Za-z\é\è\ê\ï\-]+$/;

let inputControlerFirstName;
let inputControlerName;
let inputControlerMail;
let inputControlerPostCode;
let inputControlerAddress;
let inputControlerCity;


const checkFirstNameIsValid = () => {
    userFirstName.addEventListener("input", function(e) {
        if (firstNameRegex.test(e.target.value)) {
            userFirstName.style.border = '2px solid green';
            userFirstNameValidIcon.style.color = '#2e2e2e';
            inputControlerFirstName = true;
        } else {
            userFirstName.style.border = '2px solid red';
            userFirstNameValidIcon.style.color = 'transparent';
            inputControlerFirstName = false;
        }
    })
}


const checkNameIsValid = () => {
    userName.addEventListener('input', function(e) {
        if (nameRegex.test(e.target.value)) {
            userName.style.border = '2px solid green';
            userNameValidIcon.style.color = '#2e2e2e';
            inputControlerName = true;
        } else {
            userName.style.border = '2px solid red';
            userNameValidIcon.style.color = 'transparent';
            inputControlerName = false; 
        }
    })
} 


const checkMailIsValid = () => {
    userMail.addEventListener("input", function(e) {
        if (emailRegex.test(e.target.value)) {
            userMail.style.border = '2px solid green';
            userMailValidIcon.style.color = '#2e2e2e';
            inputControlerMail = true;
        } else {
            userMail.style.border = '2px solid red';
            userMailValidIcon.style.color = 'transparent';
            inputControlerMail = false;
        }
    })
}

 
const checkPostCodeIsValid = () => {
    userPostCode.addEventListener("input", function(e) {
        if (postCodeRegex.test(e.target.value)) {
            userPostCode.style.border = '2px solid green';
            userPostCodeValidIcon.style.color = '#2e2e2e';
            inputControlerPostCode = true;
        } else {
            userPostCode.style.border = '2px solid red';
            userPostCodeValidIcon.style.color = 'transparent';
            inputControlerPostCode = false;
        }
    })
     
}


const checkAddressIsValid = () => {
    userAddress.addEventListener("input", function(e) {
        if (addressRegex.test(e.target.value)) {
            userAddress.style.border = '2px solid green';
            userAddressValidIcon.style.color = '#2e2e2e';
            inputControlerAddress = true;
        } else {
            userAddress.style.border = '2px solid red';
            userAddressValidIcon.style.color = 'transparent';
            inputControlerAddress = false; 
        }
    })
}


const checkCityIsValid = () => {
    userCity.addEventListener("input", function(e) {
        if (cityRegex.test(e.target.value)) {
            userCity.style.border = '2px solid green';
            userCityValidIcon.style.color = '#2e2e2e';
            inputControlerCity = true;
        } else {
            userCity.style.border = '2px solid red';
            userCityValidIcon.style.color = 'transparent';
            inputControlerCity = false;
        }
    })
}


// Ecoute d'un input vide pour détecter une attaque.
const inputDetect = document.getElementById('input-detect');
inputDetect.addEventListener("input", function(a) {
    if ((a.target.value) != "") {
        alert("Tentative d'intrusion détectée");
    }
}); 


checkFirstNameIsValid();
checkNameIsValid();
checkMailIsValid();
checkPostCodeIsValid();
checkAddressIsValid();
checkCityIsValid();


// Ecoute le changement de valeur de chaque champs du formulaire et active le bouton commander et créer un objet contact. 
let contact = '';
contactForm.addEventListener('change', function(z) {
    if ((userName.value != "") && (userFirstName.value != "") && (userMail.value != "") && (userPostCode.value != "") && (userAddress.value != "") && (userCity.value != "")) {
        checkFormIsValid();
        contact = {
            firstName: userName.value,
            lastName: userFirstName.value,
            address: userAddress.value,
            city: userPostCode.value + " " + userCity.value, 
            email: userMail.value,
        };
    } 
});


// Création d'un tableau contenant les références des tout les produits du panier.
let products = [];
const addItemOfProdusts = () => productsOnLocaleStorage.forEach(item => {
    products.push(item.ref);
});


// Vérifie que le local storage ne soit pas vide.
if (productsOnLocaleStorage != null) {
    addProductForEachProducts();
    getSumOfQuantityProducts();
    addItemOfProdusts();
    getSumPriceProductStorage();
}


// Contrôle que les informations renseignées par l'utilisateur sont valides.
const checkFormIsValid = () => {
    if ((inputControlerFirstName === true) 
    && (inputControlerName === true)
    && (inputControlerMail === true) 
    && (inputControlerAddress === true) 
    && (inputControlerPostCode === true)
    && (inputControlerCity === true))  {
        purchaseBtn.removeAttribute('disabled');
    } else {
        purchaseBtn.setAttribute('disabled', true)
    }
}


// Envoi des informations de la commande.
const sendOrder = () => {
    fetch("http://localhost:3000/api/cameras/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ contact, products }),
        })
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("contact", JSON.stringify(contact));
            localStorage.setItem("products", JSON.stringify(products));
            localStorage.setItem("orderId", JSON.stringify(data.orderId));
            document.location.href = "order-confirmation.html";
        })
        .catch((erreur) => console.log("erreur : " + erreur)); 
} 


// Ecoute le click du bouton commander et envoie la requête si la condition est respectée.
purchaseBtn.addEventListener('click', sendOrder);











