const itemContactOfLocaleStorage = JSON.parse(localStorage.getItem("contact"));
const itemOrderIdOfLocaleStorage = JSON.parse(localStorage.getItem("orderId")) ;
const productsOnLocaleStorage = JSON.parse(localStorage.getItem('viewCartProduct'));


// Affiche un message de confirmation de la commande avec ses informations.
const displayConfirmationOrderMessage = () => {
    document.getElementById('confirm-message-name').textContent = itemContactOfLocaleStorage.firstName;
    document.getElementById('confirm-message-orderId').textContent = itemOrderIdOfLocaleStorage;
    document.getElementById('confirm-message-address').textContent = itemContactOfLocaleStorage.address;
    document.getElementById('confirm-message-city').textContent = itemContactOfLocaleStorage.city;
    document.getElementById('confirm-message-email').textContent = itemContactOfLocaleStorage.email;
}
displayConfirmationOrderMessage();


// Pour chaque produit stocké dans le storage, est crée une ligne de tableau et son prix est ajouté au précédent.
let sumPriceOfProductsStorage ='';
const getSumPriceOfProductsStorage = () => productsOnLocaleStorage.forEach(product => {    
    sumPriceOfProductsStorage += product.price;
    sumPriceOfProductsStorage ++ ;
});
getSumPriceOfProductsStorage();


const addInformationsForInvoice = () => {
    document.getElementById('invoice-orderId').textContent = (itemOrderIdOfLocaleStorage.substring(5,0)) + (itemOrderIdOfLocaleStorage.substring(26,32));
    document.getElementById('order-total-price').textContent =  (new Intl.NumberFormat("fr-FR", {style: "currency", currency: "EUR"}).format(sumPriceOfProductsStorage / 1000));
}


const buttonLogo = document.getElementById('logo-btn');
const buttonThatLeadsToShoppingCart = document.getElementById('shopping-cart-btn');
const buttonToReturnHome = document.getElementById('return-home');



const clearProductsOfShoppingCart = () => localStorage.clear();


buttonLogo.addEventListener('click', clearProductsOfShoppingCart);
buttonThatLeadsToShoppingCart.addEventListener('click', clearProductsOfShoppingCart);
buttonToReturnHome.addEventListener('click', clearProductsOfShoppingCart);


// Créer une ligne de tableau avec les différentes valeurs du produits.
const createProductInformationLigne = (product) => {
    const templateElement = document.getElementById("productTemplate")
    const productHtml = document.importNode(templateElement.content, true)
    productHtml.getElementById("refStor").setAttribute('id', product.ref);
    productHtml.getElementById("nameStor").textContent = product.nameProduct;
    productHtml.getElementById("quantityStor").textContent = product.quantity;
    productHtml.getElementById("optionStor").textContent = product.option;
    productHtml.getElementById("priceStor").textContent = (new Intl.NumberFormat("fr-FR", {style: "currency", currency: "EUR"}).format(product.price / 1000));
    document.getElementById('tableStor').appendChild(productHtml);
}


const createProductInformationLigneForEachProduct = () => productsOnLocaleStorage.forEach(product => createProductInformationLigne(product));


// Permet de visualiser la facture et de l'imprimer.
const displayInvoice = () => {
    addInformationsForInvoice();
    createProductInformationLigneForEachProduct();
    window.print();
    buttonToDisplayInvoice.setAttribute('disabled', true);
}


const buttonToDisplayInvoice = document.getElementById('display-invoice');
buttonToDisplayInvoice.addEventListener('click', displayInvoice);