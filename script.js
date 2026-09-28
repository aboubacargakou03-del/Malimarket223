// REMPLACEZ CETTE VALEUR PAR VOTRE NUMÉRO WHATSAPP AVEC L'INDICATIF DU MALI, SANS + NI ESPACES.
const WHATSAPP_NUMBER = "22394428802";

const products = [
  {name:"Couveuse automatique 176 œufs", price:100000, category:"elevage", icon:"🐣", desc:"Couveuse automatique de grande capacité pour votre élevage."},
  {name:"Couveuse automatique 96 œufs", price:75000, category:"elevage", icon:"🥚", desc:"Solution pratique pour les petits et moyens élevages."},
  {name:"Couveuse automatique 48 œufs", price:50000, category:"elevage", icon:"🐥", desc:"Format compact pour démarrer votre activité."},
  {name:"Affiche publicitaire", price:10000, category:"publicite", icon:"🎨", desc:"Création d'une affiche professionnelle pour votre activité."},
  {name:"Carte de visite", price:5000, category:"publicite", icon:"📇", desc:"Design moderne de carte de visite pour votre entreprise."},
  {name:"Panneau publicitaire", price:25000, category:"publicite", icon:"📣", desc:"Conception graphique de panneau publicitaire sur mesure."},
  {name:"Design restaurant", price:15000, category:"services", icon:"🍽️", desc:"Menu, affiche et visuels adaptés à votre restaurant."},
  {name:"Design salon de coiffure", price:15000, category:"services", icon:"💇🏿‍♀️", desc:"Visuels attractifs pour votre salon et vos réseaux sociaux."},
  {name:"Design boutique", price:15000, category:"services", icon:"🏪", desc:"Pack visuel pour présenter votre boutique sur Facebook et WhatsApp."}
];

let cart = JSON.parse(localStorage.getItem("mm223_cart") || "[]");

function money(n){ return new Intl.NumberFormat("fr-FR").format(n) + " F CFA"; }

function renderProducts(list=products){
  document.getElementById("products").innerHTML = list.map((p,i)=>`
    <article class="product">
      <div class="product-img">${p.icon}</div>
      <div class="product-body">
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="price">${money(p.price)}</div>
        <button class="btn primary full" onclick="addToCart('${p.name.replace(/'/g,"\\'")}',${p.price})">Ajouter au panier</button>
        <button class="btn whatsapp full" onclick="buyNow('${p.name.replace(/'/g,"\\'")}',${p.price})">Commander sur WhatsApp</button>
      </div>
    </article>`).join("");
}
function filterProducts(cat,btn){
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active")); btn.classList.add("active");
  renderProducts(cat==="all"?products:products.filter(p=>p.category===cat));
}
function addToCart(name,price){
  const found=cart.find(x=>x.name===name);
  if(found) found.qty++; else cart.push({name,price,qty:1});
  saveCart(); renderCart(); location.hash="panier";
}
function removeFromCart(i){cart.splice(i,1);saveCart();renderCart();}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);saveCart();renderCart();}
function saveCart(){localStorage.setItem("mm223_cart",JSON.stringify(cart));document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);}
function renderCart(){
  const box=document.getElementById("cartBox");
  if(!cart.length){box.innerHTML="<p>Votre panier est vide.</p>";saveCart();return;}
  let total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  box.innerHTML=`${cart.map((x,i)=>`<div class="cart-row"><div><strong>${x.name}</strong><br><button class="remove" onclick="changeQty(${i},-1)">−</button> ${x.qty} <button class="remove" onclick="changeQty(${i},1)">+</button></div><div>${money(x.price*x.qty)} <button class="remove" onclick="removeFromCart(${i})">Supprimer</button></div></div>`).join("")}
  <div class="cart-total">Total : ${money(total)}</div>
  <div class="order-form">
    <input id="customerName" placeholder="Votre nom">
    <input id="customerCity" placeholder="Ville / quartier de livraison">
    <textarea id="customerNote" placeholder="Précision ou question (facultatif)"></textarea>
    <button class="btn whatsapp full" onclick="checkout()">📲 Envoyer la commande sur WhatsApp</button>
  </div>`;
}
function buildMessage(){
  const lines=cart.map(x=>`• ${x.name} x${x.qty} = ${money(x.price*x.qty)}`);
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const name=document.getElementById("customerName")?.value || "";
  const city=document.getElementById("customerCity")?.value || "";
  const note=document.getElementById("customerNote")?.value || "";
  return `Bonjour MaliMarket 223 👋\n\nJe souhaite commander :\n${lines.join("\n")}\n\nTotal : ${money(total)}\nNom : ${name}\nLieu de livraison : ${city}\nNote : ${note || "Aucune"}\n\nMerci de me confirmer la disponibilité et la livraison.`;
}
function checkout(){if(WHATSAPP_NUMBER.includes("X")){alert("Remplacez d'abord WHATSAPP_NUMBER dans script.js par votre numéro WhatsApp.");return;} window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`,"_blank");}
function buyNow(name,price){if(WHATSAPP_NUMBER.includes("X")){alert("Remplacez d'abord WHATSAPP_NUMBER dans script.js par votre numéro WhatsApp.");return;}const msg=`Bonjour MaliMarket 223 👋\n\nJe souhaite commander : ${name}\nPrix : ${money(price)}\n\nMerci de me confirmer la disponibilité et la livraison.`;window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");}
function openWhatsApp(msg){if(WHATSAPP_NUMBER.includes("X")){alert("Remplacez d'abord WHATSAPP_NUMBER dans script.js par votre numéro WhatsApp.");return;}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");}
function toggleMenu(){document.getElementById("navlinks").classList.toggle("open");}
renderProducts();renderCart();