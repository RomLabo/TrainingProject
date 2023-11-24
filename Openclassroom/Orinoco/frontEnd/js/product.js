const apiUrl = "http://localhost:3000/api/cameras";

const idOfProduct = window.location.search.substring(5);

// Requête à l'api avec l'id du produit sélectionné
fetch(apiUrl + "/" + idOfProduct)
    .then((response) => response.json())
    .then((data) => (idOfProduct === data._id) ? createProductForLocalStorage(data) : displayUrlAlert())
    .catch((err) => console.log('Error :' + err))
;


// Créer un article avce toutes les informations liés au produit sélectionné.
const createProductForLocalStorage = (data) => {
    createProduct(data);
    createLensesOption(data);
    populateLocalStorage(data); 
}


// Ajout des valeurs du produit à chaque élément composant l'élément 'article'.
const createProduct = (data) => {
    document.getElementById("articleId").setAttribute("id", data._id);
    document.getElementById("articleTitle").textContent = data.name;
    document.getElementById("articlePrice").textContent = (new Intl.NumberFormat("fr-FR", {style: "currency", currency: "EUR"}).format(data.price / 1000));
    document.getElementById("articleImage").setAttribute("src", data.imageUrl);
    document.getElementById("articleDescription").textContent = data.description;          
}


// Pour chaque objectifs du produit il sera crée une option dans l'élément 'select'
const createLensesOption = (data) => {
    let allLenses = data.lenses;
    let lensesOption = `<option value="">Choisir une option</option>`;
        for (let lense of allLenses) {
            lensesOption += `<option value="${lense}">${lense}</option>`
        }
    document.querySelector('#lenses-select').innerHTML = lensesOption;
}


// Ajoute le produit sélectioné dans le local storage.
const populateLocalStorage = (data) => {
    getOptionChoiceValue();
    getQuantityChoiceValue();
    let buttonAddToShoppingCart = document.getElementById('add');
    buttonAddToShoppingCart.addEventListener('click', () =>  {
        if ((quantityChoiceValue >= 1 ) && (optionChoiceValue != "")) {
            createProductObject(data);
            let productsOnLocaleStorage = JSON.parse(localStorage.getItem("viewCartProduct"))
            if (productsOnLocaleStorage) {
                searchSameProductObject(productsOnLocaleStorage, data);
            } else {
                productsOnLocaleStorage = [];
                addProductObjectOnLocalStorage(productsOnLocaleStorage);
            }
            displayConfirmationWindow(); 
            updateSumQuantityOfProduct();   
        } else {
            displayErrorEmptyChoiceAndQuantity();
        }
    })
}


let optionChoiceValue = '';
const getOptionChoiceValue = () => {
    optionChoice = document.getElementById('lenses-select');
    optionChoice.addEventListener('change', (e) => optionChoiceValue = e.target.value)
}


let quantityChoiceValue = '';
const getQuantityChoiceValue = () => {
    let quantityOfProduct = document.getElementById('quantity');
    quantityOfProduct.addEventListener('change', (event) =>  quantityChoiceValue = event.target.value)
}


let productObject = '';
const createProductObject = (data) => {
    productObject = {
        ref: data._id,
        price: data.price * quantityChoiceValue,
        nameProduct: data.name,
        quantity: quantityChoiceValue,
        option: optionChoiceValue,
    }
}


const searchSameProductObject = (productsOnLocaleStorage, data) => {
    ((productsOnLocaleStorage.some(productObject => optionChoiceValue === productObject.option)) 
    && (productsOnLocaleStorage.some(productObject => productObject.ref === productObject.ref))) ? replaceQuantiyWhenSameProductObject(productsOnLocaleStorage, data) : addProductObjectOnLocalStorage(productsOnLocaleStorage);
}


const replaceQuantiyWhenSameProductObject = (productsOnLocaleStorage, data) => {
    let indexProduct;
    let productQuantityChange;
    indexProduct = productsOnLocaleStorage.findIndex(productObject => optionChoiceValue === productObject.option);
    productQuantityChange = JSON.parse(productObject.quantity) + JSON.parse(productsOnLocaleStorage[indexProduct].quantity);
    productObject.quantity = JSON.stringify(productQuantityChange); 
    productObject.price = data.price * productQuantityChange;   
    productsOnLocaleStorage.splice(indexProduct,1, productObject);
    localStorage.setItem("viewCartProduct", JSON.stringify(productsOnLocaleStorage));
}


const addProductObjectOnLocalStorage = (productsOnLocaleStorage) => {
    productsOnLocaleStorage.push(productObject);
    localStorage.setItem("viewCartProduct", JSON.stringify(productsOnLocaleStorage));
}


const confirmationWindow = document.getElementById('window-confirmation');
const windowProduct = document.querySelector('article.product');


const displayConfirmationWindow = () => {
    confirmationWindow.style.display = 'flex';
    windowProduct.style.opacity = '0.2';
}


const closeConfirmationWindow = () => {
    confirmationWindow.style.display = 'none';
    windowProduct.style.opacity = '1';
}


const confirmationWindowBtn = document.getElementById('confirmation-btn');
confirmationWindowBtn.addEventListener('click', closeConfirmationWindow);


const updateSumQuantityOfProduct = () => {
    sumOfQuantityProducts += Number(quantityChoiceValue);
    counterQuantityDisplay.textContent = sumOfQuantityProducts;
    sumOfQuantityProducts < 100 ? counterQuantityDisplay.style.display = 'flex' : counterQuantityDisplay.style.display = 'none' ;
}


// Ajoute un compteur de produit au bouton panier.
let productsOnLocaleStorage = JSON.parse(localStorage.getItem('viewCartProduct'));
let sumOfQuantityProducts = 0;
let counterQuantityDisplay = document.getElementById('count');


const calculateSumOfQuantityProducts = () => productsOnLocaleStorage.forEach(product => {
    sumOfQuantityProducts += Number(product.quantity);
    counterQuantityDisplay.textContent = sumOfQuantityProducts;
    sumOfQuantityProducts < 100 ? counterQuantityDisplay.style.display = 'flex' : counterQuantityDisplay.style.display = 'none' ;
})


const getSumOfQuantityProducts = () => {
    if (productsOnLocaleStorage != null) {
        calculateSumOfQuantityProducts();
    }
}


window.onload = getSumOfQuantityProducts();


const errorChoiceWindow = document.getElementById('window-error-quantity');
const displayErrorEmptyChoiceAndQuantity = () => {
    errorChoiceWindow.style.display = 'flex';
    windowProduct.style.opacity = '0.2';
}


const closeErrorEmptyChoiceAndQuantity = () => {
    errorChoiceWindow.style.display = 'none';
    windowProduct.style.opacity = '1';
}


const errorChoiceWindowBtn = document.getElementById('error-btn');
errorChoiceWindowBtn.addEventListener('click', closeErrorEmptyChoiceAndQuantity);


// Affiche un message d'alerte si une érreur est détecté dans l'url.
const displayUrlAlert = () => {
    document.getElementById('sectionTitle').textContent = "Un problème est servenu veuillez revenir sur la page principal, Merci.";
    document.getElementById('product').style.display = 'none';
} 

















