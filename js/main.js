
let cuentas = [
    { nombre: "Mali", saldo: 200, password: "1234", dni: "44788834" },
    { nombre: "Gera", saldo: 150, password: "5678", dni: "10247439" },
    { nombre: "Sabi", saldo: 60, password: "9102", dni: "98005362" }
];

let usuarioActual = null;
let intentosPassword = 0;
const MAX_INTENTOS = 3;

function mostrarPantalla(pantallaId) {
    const pantallas = [
        'dniScreen', 'passwordScreen', 'mainMenu', 'saldoScreen',
        'ingresarScreen', 'retirarScreen', 'confirmacionDepositoScreen',
        'confirmacionRetiroScreen'
    ];

    pantallas.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });

    document.getElementById(pantallaId).classList.remove('hidden');
}

function mostrarMensaje(elementId, mensaje, tipo) {
    const element = document.getElementById(elementId);
    const clase = tipo === 'error' ? 'error-box' : tipo === 'success' ? 'success-box' : 'info-box';
    element.innerHTML = `<div class="${clase}">${mensaje}</div>`;
}

function limpiarMensaje(elementId) {
    document.getElementById(elementId).innerHTML = '';
}

function verificarDNI() {
    const dni = document.getElementById('dniInput').value.trim();

    if (dni === '') {
        mostrarMensaje('dniMessage', '⚠ Por favor ingrese su DNI', 'error');
        return;
    }

    if (dni.length !== 8 || isNaN(dni)) {
        mostrarMensaje('dniMessage', '⚠ DNI inválido. Debe tener 8 dígitos', 'error');
        return;
    }

    const usuario = cuentas.find(cuenta => cuenta.dni === dni);

    if (usuario) {
        usuarioActual = usuario;
        intentosPassword = 0;
        document.getElementById('dniInfo').textContent = `DNI: ${dni}`;
        /*document.getElementById('dniInfo').textContent = + "DNI: "+ dni;*/
        document.getElementById('passwordInput').value = '';
        limpiarMensaje('passwordMessage');
        mostrarPantalla('passwordScreen');
        setTimeout(() => {
            document.getElementById('passwordInput').focus();
        }, 100);
    } else {
        mostrarMensaje('dniMessage', '⚠ DNI no encontrado. Verifique sus datos', 'error');
        document.getElementById('dniInput').value = '';
    }
}

function verificarPassword() {
    const password = document.getElementById('passwordInput').value;

    if (password === '') {
        mostrarMensaje('passwordMessage', '⚠ Por favor ingrese su contraseña', 'error');
        return;
    }

    if (password === usuarioActual.password) {
        mostrarMensaje('passwordMessage', '✓ Acceso autorizado', 'success');
        setTimeout(() => {
            mostrarMenuPrincipal();
        }, 1000);
    } else {
        intentosPassword++;
        if (intentosPassword >= MAX_INTENTOS) {
            mostrarMensaje('passwordMessage', '⚠ Demasiados intentos fallidos. Por seguridad, debe reiniciar', 'error');
            setTimeout(() => {
                reiniciarCajero();
            }, 2500);
        } else {
            mostrarMensaje('passwordMessage', `⚠ Contraseña incorrecta. Intento ${intentosPassword} de ${MAX_INTENTOS}`, 'error');
            document.getElementById('passwordInput').value = '';
        }
    }
}

function mostrarMenuPrincipal() {
    document.getElementById('userWelcome').textContent = `Bienvenido/a ${usuarioActual.nombre}`;
    mostrarPantalla('mainMenu');
}

function irConsultarSaldo() {
    document.getElementById('saldoUserInfo').textContent = `Cuenta: ${usuarioActual.nombre}`;
    document.getElementById('saldoDisplay').textContent = `S/ ${usuarioActual.saldo.toFixed(2)}`;

    // Obtener fecha y hora del sistema
    const ahora = new Date();
    const opciones = {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const fechaFormateada = ahora.toLocaleDateString('es-PE', opciones);

    document.getElementById('fechaActualizacion').textContent = `Última actualización: ${fechaFormateada}`;

    mostrarPantalla('saldoScreen');
}

function irIngresarMonto() {
    document.getElementById('ingresarUserInfo').textContent = `Cuenta: ${usuarioActual.nombre}`;
    document.getElementById('montoIngresar').value = '';
    limpiarMensaje('ingresarMessage');
    mostrarPantalla('ingresarScreen');
    setTimeout(() => {
        document.getElementById('montoIngresar').focus();
    }, 100);
}

function confirmarDeposito() {
    const monto = parseFloat(document.getElementById('montoIngresar').value);

    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje('ingresarMessage', '⚠ Ingrese un monto válido mayor a S/ 0.00', 'error');
        return;
    }

    if (monto > 10000) {
        mostrarMensaje('ingresarMessage', '⚠ El monto máximo por depósito es S/ 10,000.00', 'error');
        return;
    }

    usuarioActual.saldo += monto;

    document.getElementById('confirmDepositoUserInfo').textContent = `Cuenta: ${usuarioActual.nombre}`;
    document.getElementById('montoDepositado').textContent = `S/ ${monto.toFixed(2)}`;
    document.getElementById('nuevoSaldoDeposito').textContent = `S/ ${usuarioActual.saldo.toFixed(2)}`;

    mostrarPantalla('confirmacionDepositoScreen');
}

function irRetirarMonto() {
    document.getElementById('retirarUserInfo').textContent = `Cuenta: ${usuarioActual.nombre} | Saldo: S/ ${usuarioActual.saldo.toFixed(2)}`;
    document.getElementById('montoRetirar').value = '';
    limpiarMensaje('retirarMessage');
    mostrarPantalla('retirarScreen');
    setTimeout(() => {
        document.getElementById('montoRetirar').focus();
    }, 100);
}

function confirmarRetiro() {
    const monto = parseFloat(document.getElementById('montoRetirar').value);

    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje('retirarMessage', '⚠ Ingrese un monto válido mayor a S/ 0.00', 'error');
        return;
    }

    if (monto > usuarioActual.saldo) {
        mostrarMensaje('retirarMessage', `⚠ Fondos insuficientes. Su saldo actual es S/ ${usuarioActual.saldo.toFixed(2)}`, 'error');
        return;
    }

    if (monto > 5000) {
        mostrarMensaje('retirarMessage', '⚠ El monto máximo por retiro es S/ 5,000.00', 'error');
        return;
    }

    usuarioActual.saldo -= monto;

    document.getElementById('confirmRetiroUserInfo').textContent = `Cuenta: ${usuarioActual.nombre}`;
    document.getElementById('montoRetirado').textContent = `S/ ${monto.toFixed(2)}`;
    document.getElementById('nuevoSaldoRetiro').textContent = `S/ ${usuarioActual.saldo.toFixed(2)}`;

    mostrarPantalla('confirmacionRetiroScreen');
}

function volverMenu() {
    mostrarMenuPrincipal();
}

function cancelarLogin() {
    reiniciarCajero();
}

function salir() {
    mostrarMensaje('dniMessage', '✓ Gracias por utilizar nuestros servicios', 'success');
    setTimeout(() => {
        reiniciarCajero();
    }, 2000);
}

function reiniciarCajero() {
    usuarioActual = null;
    intentosPassword = 0;
    document.getElementById('dniInput').value = '';
    document.getElementById('passwordInput').value = '';
    limpiarMensaje('dniMessage');
    limpiarMensaje('passwordMessage');
    mostrarPantalla('dniScreen');
    setTimeout(() => {
        document.getElementById('dniInput').focus();
    }, 100);
}

// Eventos de teclado
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const dniScreen = document.getElementById('dniScreen');
        const passwordScreen = document.getElementById('passwordScreen');
        const ingresarScreen = document.getElementById('ingresarScreen');
        const retirarScreen = document.getElementById('retirarScreen');

        if (!dniScreen.classList.contains('hidden')) {
            verificarDNI();
        } else if (!passwordScreen.classList.contains('hidden')) {
            verificarPassword();
        } else if (!ingresarScreen.classList.contains('hidden')) {
            confirmarDeposito();
        } else if (!retirarScreen.classList.contains('hidden')) {
            confirmarRetiro();
        }
    }
});

// Inicializar
document.getElementById('dniInput').focus();