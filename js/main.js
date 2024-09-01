fetch('../data.json')
    .then(response => response.json())
    .then(productos => {
        container.innerHTML = ``
        productos.forEach (el => crearCard(el))

        const mostrar = document.createElement("button");
        mostrar.innerText = "Mostrar carrito";
        mostrar.classList.add("btn-2")

        const limpiar = document.createElement("button");
        limpiar.innerText = "Limpiar carrito";
        limpiar.classList.add("btn-3")

        mostrar.addEventListener("click", () => {
            document.getElementById("carrito-div").innerHTML = "";
            carrito.forEach(el => mostrarCarrito(el));
        });
        limpiar.addEventListener("click", () => {
            if (carrito.length > 0) {
                Swal.fire({
                    title: 'Está seguro de limpiar el carrito?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, seguro',
                    cancelButtonText: 'No, no quiero'
                })
                    .then(result => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                title: "Carrito",
                                text: "Se limpio el carrito",
                                icon: "success",
                            });
                            carrito = [];
                            localStorage.setItem("carrito", JSON.stringify(carrito));
                        } else {
                            Swal.fire({
                                title: "Carrito",
                                text: "No se limpio el carrito",
                                icon: "error",
                            });
                        };
                    });
            } else {
                Toastify({
                    text: "El carrito está vacío. No lo podés limpiar",
                }).showToast();
            }
        });

        container.append(mostrar);
        container.append(limpiar);
    })
    .catch(error => console.error('Error al cargar los productos:', error));

//Carrito

let carrito = [];



if(localStorage.getItem("carrito")){
    carrito = JSON.parse(localStorage.getItem("carrito"))
} else {
    carrito =[];
};

function agregarAlCarrito(producto) {
    if (!producto || !producto.id) {
        Toastify({
            text: "El producto es nulo o no tiene un ID válido", producto
        }).showToast();
        return;
    }

    const{id, nombre, precio} = producto;

    if (carrito.some(el => el.id === id)) {
        const indexProducto = carrito.findIndex(el => el.id === id);
        carrito[indexProducto].cantidad += 1;
        carrito[indexProducto].subtotal = carrito[indexProducto].cantidad * carrito[indexProducto].precio
    } else {
        const nuevoProducto = {
            id,
            nombre,
            precio,
            cantidad: 1,
            subtotal: producto.precio
        };
        carrito.push(nuevoProducto);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));

    Toastify({
        text: "Se agrego el producto al carrito",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){}
    }).showToast();
}

function crearCard(producto) {
    const card = document.createElement("div");
    card.className = "card";

    const titulo = document.createElement("h4");
    titulo.innerText = producto.nombre;

    const precio = document.createElement("p");
    precio.innerText = `$${producto.precio}`;

const boton = document.createElement("button");
boton.innerText = "Agregar al carrito";
boton.classList.add("btn-1")
boton.onclick = () => agregarAlCarrito(producto);

const imagen = document.createElement("img");
imagen.src = producto.imagen;
imagen.className = "img";

card.append(imagen, titulo, precio, boton);

container.append(card);
}

function mostrarCarrito (producto){
    const card = document.createElement("div");
    card.className = "card";

    const titulo = document.createElement("h4");
    titulo.innerText = producto.nombre;

    const precio = document.createElement("p");
    precio.innerText = `$${producto.precio}`;

    const cantidad = document.createElement("p");
    cantidad.innerText = `Cantidad: ${producto.cantidad}`;

    const preciototal = document.createElement("p");
    preciototal.innerText = `Total: $${producto.precio * producto.cantidad}`;

card.append(titulo, precio, cantidad, preciototal);
document.getElementById("carrito-div").append(card);
}

container.append(mostrar);
container.append(limpiar);