/* =========================================================
   Gestión Comercial — frontend conectado a Spring Boot
   ========================================================= */

(() => {
    'use strict';

    /* =====================================================
       CONFIGURACIÓN
       ===================================================== */

    const API = {
        clientes: '/api/clientes',
        productos: '/api/productos',
        pedidos: '/api/pedidos',
        detalles: '/api/detalles',
        pagos: '/api/pagos',
        informes: '/api/informes'
    };

    const STOCK_BAJO = 5;

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];

    const moneda = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    });

    const entero = new Intl.NumberFormat('es-CO');


    /* =====================================================
       UTILIDADES
       ===================================================== */

    const esc = (valor) =>
        String(valor ?? '').replace(/[&<>"']/g, (c) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c]));

    const cap = (texto) =>
        texto
            ? texto.charAt(0).toUpperCase() + texto.slice(1)
            : '';

    const hoy = () => {
        const d = new Date();

        return `${d.getFullYear()}-${String(
            d.getMonth() + 1
        ).padStart(2, '0')}-${String(
            d.getDate()
        ).padStart(2, '0')}`;
    };

    const fecha = (valor) => {
        if (!valor) return '—';

        try {
            return new Date(
                `${valor}T00:00:00`
            ).toLocaleDateString(
                'es-CO',
                {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }
            );
        } catch {
            return valor;
        }
    };

    const pill = (estado) =>
        `<span class="estado estado-${esc(
            String(estado).toLowerCase()
        )}">
            ${esc(cap(String(estado).toLowerCase()))}
        </span>`;

    const celda = (principal, secundario) =>
        `<div class="celda-principal">
            <strong>${esc(principal)}</strong>
            ${
                secundario
                    ? `<span>${esc(secundario)}</span>`
                    : ''
            }
        </div>`;


    /* =====================================================
       ESTADOS DEL BACKEND
       ===================================================== */

    const ESTADOS_PEDIDO = [
        'PENDIENTE',
        'CONFIRMADO',
        'ENTREGADO',
        'CANCELADO'
    ];

    const ESTADOS_PAGO = [
        'PENDIENTE',
        'PAGADO',
        'RECHAZADO'
    ];

    const METODOS_PAGO = [
        'EFECTIVO',
        'TARJETA',
        'TRANSFERENCIA'
    ];

    const TIPOS_CLIENTE = [
        'NATURAL',
        'EMPRESA'
    ];


    /* =====================================================
       BASE DE DATOS DEL FRONTEND
       ===================================================== */

    let db = {
        clientes: [],
        productos: [],
        pedidos: [],
        detalles: [],
        pagos: []
    };


    /* =====================================================
       ESTADO DE LA INTERFAZ
       ===================================================== */

    const ui = {
        clientes: {
            editId: null,
            q: ''
        },

        productos: {
            editId: null,
            q: ''
        },

        pedidos: {
            editId: null,
            q: ''
        },

        detalles: {
            editId: null,
            q: ''
        },

        pagos: {
            editId: null,
            q: ''
        }
    };


    /* =====================================================
       PETICIONES HTTP
       ===================================================== */

    async function apiFetch(url, options = {}) {

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        };

        const respuesta =
            await fetch(url, config);

        let datos = null;

        const tipo =
            respuesta.headers.get(
                'content-type'
            ) || '';

        if (
            tipo.includes('application/json')
        ) {
            try {
                datos =
                    await respuesta.json();
            } catch {
                datos = null;
            }
        }

        if (!respuesta.ok) {

            let mensaje =
                `Error ${respuesta.status}`;

            if (datos) {

                mensaje =
                    datos.message ||
                    datos.error ||
                    datos.mensaje ||
                    mensaje;
            }

            throw new Error(mensaje);
        }

        return datos;
    }


    /* =====================================================
       CARGAR DATOS DESDE SPRING BOOT
       ===================================================== */

    async function cargarDatos() {

        try {

            const resultados =
                await Promise.all([
                    apiFetch(API.clientes),
                    apiFetch(API.productos),
                    apiFetch(API.pedidos),
                    apiFetch(API.detalles),
                    apiFetch(API.pagos)
                ]);

            db.clientes =
                Array.isArray(resultados[0])
                    ? resultados[0]
                    : [];

            db.productos =
                Array.isArray(resultados[1])
                    ? resultados[1]
                    : [];

            db.pedidos =
                Array.isArray(resultados[2])
                    ? resultados[2]
                    : [];

            db.detalles =
                Array.isArray(resultados[3])
                    ? resultados[3]
                    : [];

            db.pagos =
                Array.isArray(resultados[4])
                    ? resultados[4]
                    : [];

            refrescar();

        } catch (error) {

            console.error(
                'Error cargando datos:',
                error
            );

            toast(
                `No se pudieron cargar los datos: ${error.message}`,
                'error'
            );
        }
    }


    /* =====================================================
       OBTENER ID
       ===================================================== */

    function idCliente(cliente) {
        return cliente?.id_cliente;
    }

    function idProducto(producto) {
        return producto?.id_producto;
    }

    function idPedido(pedido) {
        return pedido?.id_pedido;
    }

    function idDetalle(detalle) {
        return detalle?.id_detalle;
    }

    function idPago(pago) {
        return pago?.id_pago;
    }


    /* =====================================================
       BÚSQUEDAS
       ===================================================== */

    function porIdCliente(id) {

        return db.clientes.find(
            c => Number(c.id_cliente) === Number(id)
        );
    }

    function porIdProducto(id) {

        return db.productos.find(
            p => Number(p.id_producto) === Number(id)
        );
    }

    function porIdPedido(id) {

        return db.pedidos.find(
            p => Number(p.id_pedido) === Number(id)
        );
    }

    function porIdDetalle(id) {

        return db.detalles.find(
            d => Number(d.id_detalle) === Number(id)
        );
    }

    function porIdPago(id) {

        return db.pagos.find(
            p => Number(p.id_pago) === Number(id)
        );
    }


    /* =====================================================
       RELACIONES
       ===================================================== */

    function nombreCliente(id) {

        const cliente =
            porIdCliente(id);

        return cliente
            ? cliente.nombre
            : 'Cliente no encontrado';
    }


    function nombreProducto(id) {

        const producto =
            porIdProducto(id);

        return producto
            ? producto.nombre
            : 'Producto no encontrado';
    }


    function pedidoDeDetalle(detalle) {

        if (!detalle) return null;

        return porIdPedido(
            detalle.id_pedido
        );
    }


    function productoDeDetalle(detalle) {

        if (!detalle) return null;

        return porIdProducto(
            detalle.id_producto
        );
    }


    /* =====================================================
       TOTAL DE PEDIDO
       ===================================================== */

    function detallesDePedido(idPedido) {

        return db.detalles.filter(
            detalle =>
                Number(detalle.id_pedido) ===
                Number(idPedido)
        );
    }


    function totalPedido(idPedido) {

        const detalles =
            detallesDePedido(idPedido);

        return detalles.reduce(
            (total, detalle) => {

                const cantidad =
                    Number(
                        detalle.cantidad || 0
                    );

                const precio =
                    Number(
                        detalle.precio || 0
                    );

                return total +
                    cantidad * precio;

            },
            0
        );
    }


    function pagosDePedido(idPedido) {

        return db.pagos.filter(
            pago =>
                Number(pago.id_pedido) ===
                Number(idPedido)
        );
    }


    function pagadoPedido(idPedido) {

        return pagosDePedido(
            idPedido
        )
        .filter(
            pago =>
                String(
                    pago.estado
                ).toUpperCase() === 'PAGADO'
        )
        .reduce(
            (total, pago) =>
                total +
                Number(pago.monto || 0),
            0
        );
    }


    function saldoPedido(idPedido) {

        return Math.max(
            0,
            totalPedido(idPedido) -
            pagadoPedido(idPedido)
        );
    }


    /* =====================================================
       USUARIO LOGUEADO
       ===================================================== */

    function obtenerUsuarioActual() {

        try {

            const raw =
                localStorage.getItem(
                    'usuarioActual'
                );

            if (!raw) {
                return null;
            }

            return JSON.parse(raw);

        } catch {

            return null;
        }
    }


    function mostrarUsuarioActual() {

        const usuario =
            obtenerUsuarioActual();

        if (!usuario) {
            return;
        }

        const nombre =
            usuario.nombre ||
            'Administrador';

        const nombreElemento =
            $('#usuarioNombre');

        const avatarElemento =
            $('#usuarioAvatar');

        const estadoElemento =
            $('#usuarioEstado');


        if (nombreElemento) {

            nombreElemento.textContent =
                nombre;
        }


        if (estadoElemento) {

            estadoElemento.textContent =
                usuario.rol ||
                'Sesión activa';
        }


        if (avatarElemento) {

            const iniciales =
                nombre
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map(
                        parte =>
                            parte
                                .charAt(0)
                                .toUpperCase()
                    )
                    .join('');

            avatarElemento.textContent =
                iniciales || 'AD';
        }
    }


    /* =====================================================
       CONFIGURACIÓN DE ENTIDADES
       ===================================================== */

    const ENT = {

        /* =================================================
           CLIENTES
           ================================================= */

        clientes: {

            etiqueta: 'Clientes',

            singular: 'cliente',

            tabla: 'tablaClientes',

            descripcion:
                'Información comercial y de contacto de tu cartera.',

            formDesc:
                'Completa los datos principales del cliente.',

            campos: [

                {
                    k: 'nombre',
                    l: 'Nombre o razón social',
                    t: 'text',
                    req: true,
                    ph: 'Ej. Tienda La Ceiba S.A.S.'
                },

                {
                    k: 'documento',
                    l: 'Documento / NIT',
                    t: 'text',
                    req: true,
                    ph: 'Ej. 900123456-1'
                },

                {
                    k: 'telefono',
                    l: 'Teléfono',
                    t: 'text',
                    ph: 'Ej. 300 555 0142'
                },

                {
                    k: 'correo',
                    l: 'Correo electrónico',
                    t: 'email',
                    ph: 'correo@empresa.com'
                },

                {
                    k: 'direccion',
                    l: 'Dirección',
                    t: 'text'
                },

                {
                    k: 'ciudad',
                    l: 'Ciudad',
                    t: 'text'
                },

                {
                    k: 'tipo_cliente',
                    l: 'Tipo de cliente',
                    t: 'select',
                    opciones: () =>
                        TIPOS_CLIENTE.map(
                            x => [x, cap(x)]
                        )
                }
            ],

            columnas: [

                {
                    t: 'Cliente',
                    r: c =>
                        celda(
                            c.nombre,
                            c.documento
                        )
                },

                {
                    t: 'Teléfono',
                    r: c =>
                        esc(
                            c.telefono || '—'
                        )
                },

                {
                    t: 'Correo',
                    r: c =>
                        esc(
                            c.correo || '—'
                        )
                },

                {
                    t: 'Ciudad',
                    r: c =>
                        esc(
                            c.ciudad || '—'
                        )
                },

                {
                    t: 'Tipo',
                    r: c =>
                        esc(
                            cap(
                                String(
                                    c.tipo_cliente ||
                                    ''
                                ).toLowerCase()
                            )
                        )
                }
            ]
        },


        /* =================================================
           PRODUCTOS
           ================================================= */

        productos: {

            etiqueta: 'Productos',

            singular: 'producto',

            tabla: 'tablaProductos',

            descripcion:
                'Catálogo de productos, precios y disponibilidad.',

            formDesc:
                'Completa la información comercial del producto.',

            campos: [

                {
                    k: 'nombre',
                    l: 'Nombre',
                    t: 'text',
                    req: true
                },

                {
                    k: 'tipo',
                    l: 'Tipo',
                    t: 'text',
                    req: true
                },

                {
                    k: 'variedad',
                    l: 'Variedad',
                    t: 'text'
                },

                {
                    k: 'descripcion',
                    l: 'Descripción',
                    t: 'textarea',
                    ancho: true
                },

                {
                    k: 'precio',
                    l: 'Precio',
                    t: 'number',
                    req: true,
                    min: 0,
                    step: '0.01'
                },

                {
                    k: 'unidad_medida',
                    l: 'Unidad de medida',
                    t: 'text'
                },

                {
                    k: 'stock',
                    l: 'Stock',
                    t: 'number',
                    req: true,
                    min: 0,
                    entero: true
                },

                {
                    k: 'imagen',
                    l: 'Imagen',
                    t: 'text',
                    ancho: true
                },

                {
                    k: 'activo',
                    l: 'Activo',
                    t: 'select',
                    opciones: () => [
                        [true, 'Activo'],
                        [false, 'Inactivo']
                    ]
                }
            ],

            columnas: [

                {
                    t: 'Producto',
                    r: p =>
                        celda(
                            p.nombre,
                            p.tipo
                        )
                },

                {
                    t: 'Variedad',
                    r: p =>
                        esc(
                            p.variedad || '—'
                        )
                },

                {
                    t: 'Precio',
                    n: true,
                    r: p =>
                        moneda.format(
                            Number(
                                p.precio || 0
                            )
                        )
                },

                {
                    t: 'Stock',
                    n: true,
                    r: p => {

                        const stock =
                            Number(
                                p.stock || 0
                            );

                        return `
                            <span class="${
                                stock <= STOCK_BAJO
                                    ? 'stock-bajo'
                                    : ''
                            }">
                                ${entero.format(stock)}
                            </span>
                        `;
                    }
                },

                {
                    t: 'Estado',
                    r: p =>
                        pill(
                            p.activo
                                ? 'activo'
                                : 'inactivo'
                        )
                }
            ],

            valida: (d) => {

                if (
                    d.precio === null ||
                    d.precio < 0
                ) {
                    return 'El precio no puede ser negativo.';
                }

                if (
                    d.stock === null ||
                    d.stock < 0
                ) {
                    return 'El stock no puede ser negativo.';
                }

                return null;
            }
        },


        /* =================================================
           PEDIDOS
           ================================================= */

        pedidos: {

            etiqueta: 'Pedidos',

            singular: 'pedido',

            tabla: 'tablaPedidos',

            descripcion:
                'Seguimiento de ventas, estados y saldos por cobrar.',

            formDesc:
                'Crea el pedido y luego agrega sus productos en Detalle de pedidos.',

            campos: [

                {
                    k: 'id_cliente',
                    l: 'Cliente',
                    t: 'select',
                    req: true,
                    vacio: 'Seleccionar cliente…',

                    opciones: () =>
                        db.clientes.map(
                            c => [
                                c.id_cliente,
                                c.nombre
                            ]
                        )
                },

                {
                    k: 'fecha',
                    l: 'Fecha del pedido',
                    t: 'date',
                    req: true,
                    defecto: hoy
                },

                {
                    k: 'estado',
                    l: 'Estado',
                    t: 'select',
                    opciones: () =>
                        ESTADOS_PEDIDO.map(
                            x => [
                                x,
                                cap(
                                    x.toLowerCase()
                                )
                            ]
                        )
                },

                {
                    k: 'observaciones',
                    l: 'Observaciones',
                    t: 'textarea',
                    ancho: true
                }
            ],

            columnas: [

                {
                    t: 'Pedido',
                    r: p =>
                        `<span class="codigo">
                            PED-${String(
                                p.id_pedido
                            ).padStart(4, '0')}
                        </span>`
                },

                {
                    t: 'Cliente',
                    r: p =>
                        celda(
                            nombreCliente(
                                p.id_cliente
                            ),
                            p.observaciones
                        )
                },

                {
                    t: 'Fecha',
                    r: p =>
                        fecha(p.fecha)
                },

                {
                    t: 'Estado',
                    r: p =>
                        pill(
                            String(
                                p.estado || ''
                            ).toLowerCase()
                        )
                },

                {
                    t: 'Total',
                    n: true,
                    r: p =>
                        moneda.format(
                            totalPedido(
                                p.id_pedido
                            )
                        )
                },

                {
                    t: 'Saldo',
                    n: true,
                    r: p => {

                        const saldo =
                            saldoPedido(
                                p.id_pedido
                            );

                        return `
                            <span class="${
                                saldo
                                    ? ''
                                    : 'saldo-cero'
                            }">
                                ${moneda.format(
                                    saldo
                                )}
                            </span>
                        `;
                    }
                }
            ],

            valida: (d) => {

                if (!d.id_cliente) {
                    return 'Selecciona un cliente.';
                }

                if (!d.fecha) {
                    return 'Selecciona una fecha.';
                }

                return null;
            }
        },


        /* =================================================
           DETALLES
           ================================================= */

        detalles: {

            etiqueta: 'Detalle de pedidos',

            singular: 'detalle',

            tabla: 'tablaDetalles',

            descripcion:
                'Productos, cantidades y precios que componen cada pedido.',

            formDesc:
                'Selecciona un pedido, un producto, la cantidad y el precio.',

            campos: [

                {
                    k: 'id_pedido',
                    l: 'Pedido',
                    t: 'select',
                    req: true,
                    vacio: 'Seleccionar pedido…',

                    opciones: () =>
                        db.pedidos.map(
                            p => [
                                p.id_pedido,
                                `PED-${String(
                                    p.id_pedido
                                ).padStart(4, '0')} · ${
                                    nombreCliente(
                                        p.id_cliente
                                    )
                                }`
                            ]
                        )
                },

                {
                    k: 'id_producto',
                    l: 'Producto',
                    t: 'select',
                    req: true,
                    vacio: 'Seleccionar producto…',

                    opciones: () =>
                        db.productos.map(
                            p => [
                                p.id_producto,
                                p.nombre
                            ]
                        )
                },

                {
                    k: 'cantidad',
                    l: 'Cantidad',
                    t: 'number',
                    req: true,
                    min: 1,
                    entero: true
                },

                {
                    k: 'precio',
                    l: 'Precio unitario',
                    t: 'number',
                    req: true,
                    min: 0,
                    step: '0.01'
                }
            ],

            columnas: [

                {
                    t: 'Pedido',
                    r: d => {

                        const pedido =
                            porIdPedido(
                                d.id_pedido
                            );

                        return pedido
                            ? celda(
                                `PED-${String(
                                    pedido.id_pedido
                                ).padStart(4, '0')}`,
                                nombreCliente(
                                    pedido.id_cliente
                                )
                            )
                            : '—';
                    }
                },

                {
                    t: 'Producto',
                    r: d =>
                        celda(
                            nombreProducto(
                                d.id_producto
                            )
                        )
                },

                {
                    t: 'Cantidad',
                    n: true,
                    r: d =>
                        entero.format(
                            Number(
                                d.cantidad || 0
                            )
                        )
                },

                {
                    t: 'Precio',
                    n: true,
                    r: d =>
                        moneda.format(
                            Number(
                                d.precio || 0
                            )
                        )
                },

                {
                    t: 'Subtotal',
                    n: true,
                    r: d =>
                        moneda.format(
                            Number(
                                d.cantidad || 0
                            ) *
                            Number(
                                d.precio || 0
                            )
                        )
                }
            ],

            valida: (d) => {

                if (!d.id_pedido) {
                    return 'Selecciona un pedido.';
                }

                if (!d.id_producto) {
                    return 'Selecciona un producto.';
                }

                if (
                    !Number.isInteger(
                        Number(d.cantidad)
                    ) ||
                    Number(d.cantidad) <= 0
                ) {
                    return 'La cantidad debe ser un entero mayor que cero.';
                }

                if (
                    Number(d.precio) < 0
                ) {
                    return 'El precio no puede ser negativo.';
                }

                return null;
            }
        },


        /* =================================================
           PAGOS
           ================================================= */

        pagos: {

            etiqueta: 'Pagos',

            singular: 'pago',

            tabla: 'tablaPagos',

            descripcion:
                'Control de pagos, métodos, fechas y estados.',

            formDesc:
                'Registra los pagos asociados a los pedidos.',

            campos: [

                {
                    k: 'id_pedido',
                    l: 'Pedido',
                    t: 'select',
                    req: true,
                    vacio: 'Seleccionar pedido…',

                    opciones: () =>
                        db.pedidos.map(
                            p => [
                                p.id_pedido,
                                `PED-${String(
                                    p.id_pedido
                                ).padStart(4, '0')} · ${
                                    nombreCliente(
                                        p.id_cliente
                                    )
                                }`
                            ]
                        )
                },

                {
                    k: 'monto',
                    l: 'Monto',
                    t: 'number',
                    req: true,
                    min: 0,
                    step: '0.01'
                },

                {
                    k: 'metodo',
                    l: 'Método de pago',
                    t: 'select',
                    opciones: () =>
                        METODOS_PAGO.map(
                            x => [
                                x,
                                cap(
                                    x.toLowerCase()
                                )
                            ]
                        )
                },

                {
                    k: 'estado',
                    l: 'Estado',
                    t: 'select',
                    opciones: () =>
                        ESTADOS_PAGO.map(
                            x => [
                                x,
                                cap(
                                    x.toLowerCase()
                                )
                            ]
                        )
                },

                {
                    k: 'fecha',
                    l: 'Fecha de pago',
                    t: 'date',
                    req: true,
                    defecto: hoy
                }
            ],

            columnas: [

                {
                    t: 'Pedido',
                    r: p => {

                        const pedido =
                            porIdPedido(
                                p.id_pedido
                            );

                        return pedido
                            ? celda(
                                `PED-${String(
                                    pedido.id_pedido
                                ).padStart(4, '0')}`,
                                nombreCliente(
                                    pedido.id_cliente
                                )
                            )
                            : '—';
                    }
                },

                {
                    t: 'Fecha',
                    r: p =>
                        fecha(p.fecha)
                },

                {
                    t: 'Método',
                    r: p =>
                        esc(
                            cap(
                                String(
                                    p.metodo || ''
                                ).toLowerCase()
                            )
                        )
                },

                {
                    t: 'Monto',
                    n: true,
                    r: p =>
                        `<strong>${
                            moneda.format(
                                Number(
                                    p.monto || 0
                                )
                            )
                        }</strong>`
                },

                {
                    t: 'Estado',
                    r: p =>
                        pill(
                            String(
                                p.estado || ''
                            ).toLowerCase()
                        )
                }
            ],

            valida: (d, id) => {

                if (!d.id_pedido) {
                    return 'Selecciona un pedido.';
                }

                if (
                    Number(d.monto) <= 0
                ) {
                    return 'El monto debe ser mayor que cero.';
                }

                if (
                    String(
                        d.estado
                    ).toUpperCase() ===
                    'PAGADO'
                ) {

                    const total =
                        totalPedido(
                            d.id_pedido
                        );

                    const pagosPagados =
                        db.pagos
                            .filter(
                                p =>
                                    Number(
                                        p.id_pedido
                                    ) ===
                                    Number(
                                        d.id_pedido
                                    ) &&
                                    String(
                                        p.estado
                                    ).toUpperCase() ===
                                    'PAGADO' &&
                                    Number(
                                        p.id_pago
                                    ) !==
                                    Number(id)
                            )
                            .reduce(
                                (s, p) =>
                                    s +
                                    Number(
                                        p.monto || 0
                                    ),
                                0
                            );

                    const saldo =
                        Math.max(
                            0,
                            total -
                            pagosPagados
                        );

                    if (
                        Number(d.monto) >
                        saldo
                    ) {
                        return `El monto supera el saldo pendiente del pedido (${moneda.format(
                            saldo
                        )}).`;
                    }
                }

                return null;
            }
        }
    };


    /* =====================================================
       TOAST
       ===================================================== */

    const toastEl =
        $('#toast');

    let toastTimer;

    function toast(
        mensaje,
        tipo = 'ok'
    ) {

        if (!toastEl) return;

        toastEl.textContent =
            mensaje;

        toastEl.className =
            `toast visible${
                tipo === 'error'
                    ? ' error'
                    : ''
            }`;

        clearTimeout(
            toastTimer
        );

        toastTimer =
            setTimeout(
                () =>
                    toastEl.classList.remove(
                        'visible'
                    ),
                3400
            );
    }


    /* =====================================================
       MENSAJES DE FORMULARIO
       ===================================================== */

    function mensaje(
        form,
        texto,
        tipo
    ) {

        const elemento =
            $('.mensaje', form);

        if (!elemento) return;

        if (!texto) {

            elemento.hidden =
                true;

            elemento.textContent =
                '';

            return;
        }

        elemento.className =
            `mensaje mensaje-${tipo}`;

        elemento.textContent =
            texto;

        elemento.hidden =
            false;
    }


    /* =====================================================
       GENERAR CAMPOS
       ===================================================== */

    function campoHTML(
        k,
        campo
    ) {

        const id =
            `${k}-${campo.k}`;

        let control;


        if (
            campo.t ===
            'select'
        ) {

            control =
                `<select
                    id="${id}"
                    name="${campo.k}">
                </select>`;

        } else if (
            campo.t ===
            'textarea'
        ) {

            control =
                `<textarea
                    id="${id}"
                    name="${campo.k}"
                    placeholder="${esc(
                        campo.ph || ''
                    )}">
                </textarea>`;

        } else {

            const extra = [

                campo.min !== undefined
                    ? `min="${campo.min}"`
                    : '',

                campo.step
                    ? `step="${campo.step}"`
                    : (
                        campo.entero
                            ? 'step="1"'
                            : ''
                    ),

                campo.ph
                    ? `placeholder="${esc(
                        campo.ph
                    )}"`
                    : ''

            ].join(' ');


            control =
                `<input
                    id="${id}"
                    name="${campo.k}"
                    type="${campo.t}"
                    ${extra}
                    autocomplete="off">`;
        }


        return `
            <div class="campo${
                campo.ancho
                    ? ' campo-ancho'
                    : ''
            }">

                <label
                    for="${id}">
                    ${esc(campo.l)}
                    ${
                        campo.req
                            ? ' *'
                            : ''
                    }
                </label>

                ${control}

            </div>
        `;
    }


    /* =====================================================
       MONTAR VISTAS CRUD
       ===================================================== */

    function montarVista(k) {

        const e =
            ENT[k];

        const vista =
            $(`#vista-${k}`);

        if (!vista) return;


        vista.innerHTML = `

            <header class="encabezado">

                <div>

                    <div class="ruta">
                        ${
                            k === 'clientes' ||
                            k === 'productos'
                                ? 'Gestión'
                                : 'Operación'
                        }
                        /
                        ${esc(e.etiqueta)}
                    </div>

                    <h1>
                        ${esc(e.etiqueta)}
                    </h1>

                    <p>
                        ${esc(e.descripcion)}
                    </p>

                </div>

                <button
                    class="boton-principal"
                    type="button"
                    data-nuevo="${k}">

                    + Nuevo
                    ${esc(e.singular)}

                </button>

            </header>


            <div
                class="formulario-panel"
                id="panel-${k}">

                <div class="panel-titulo">

                    <div>

                        <h2
                            data-form-titulo>

                            Registrar
                            ${esc(e.singular)}

                        </h2>

                        <p>
                            ${esc(e.formDesc)}
                            Los campos con *
                            son obligatorios.
                        </p>

                    </div>

                </div>


                <form
                    class="formulario"
                    id="form-${k}"
                    data-ent="${k}"
                    novalidate>

                    ${e.campos
                        .map(
                            f =>
                                campoHTML(
                                    k,
                                    f
                                )
                        )
                        .join('')}


                    <div
                        class="mensaje"
                        hidden
                        role="alert">
                    </div>


                    <div
                        class="acciones-formulario">

                        <button
                            class="boton-secundario"
                            type="button"
                            data-limpiar="${k}">

                            Limpiar

                        </button>


                        <button
                            class="boton-principal"
                            type="submit"
                            data-guardar>

                            Guardar
                            ${esc(e.singular)}

                        </button>

                    </div>

                </form>

            </div>


            <div class="panel">

                <div class="panel-titulo">

                    <div>

                        <h2>
                            Listado de
                            ${esc(
                                e.etiqueta
                                    .toLowerCase()
                            )}
                        </h2>

                        <p>
                            Edita o elimina registros
                            directamente desde la tabla.
                        </p>

                    </div>


                    <div class="herramientas">

                        <input
                            class="buscador"
                            type="search"
                            data-buscar="${k}"
                            placeholder="Buscar…"
                            aria-label="Buscar en ${esc(
                                e.etiqueta
                            )}">

                        <span
                            class="contador"
                            data-contador>
                            0 registros
                        </span>

                    </div>

                </div>


                <div class="tabla-wrap">

                    <table
                        id="${e.tabla}">

                        <thead>
                        </thead>

                        <tbody>
                        </tbody>

                    </table>

                </div>

            </div>
        `;
    }


    /* =====================================================
       SELECTS
       ===================================================== */

    function llenarSelects() {

        for (
            const [k, e]
            of Object.entries(ENT)
        ) {

            const form =
                $(`#form-${k}`);

            if (!form) continue;


            for (
                const campo
                of e.campos.filter(
                    c =>
                        c.t ===
                        'select'
                )
            ) {

                const select =
                    form.elements[
                        campo.k
                    ];

                if (!select) continue;

                const previo =
                    select.value;

                const items =
                    campo.opciones();

                select.innerHTML =
                    (
                        campo.vacio
                            ? `<option value="">
                                ${esc(
                                    campo.vacio
                                )}
                               </option>`
                            : ''
                    ) +
                    items
                        .map(
                            ([valor, etiqueta]) =>
                                `<option value="${esc(
                                    valor
                                )}">
                                    ${esc(
                                        etiqueta
                                    )}
                                </option>`
                        )
                        .join('');


                if (
                    [
                        ...select.options
                    ].some(
                        option =>
                            String(
                                option.value
                            ) ===
                            String(
                                previo
                            )
                    )
                ) {

                    select.value =
                        previo;
                }
            }
        }
    }


    /* =====================================================
       RESET FORMULARIO
       ===================================================== */

    function resetForm(k) {

        const e =
            ENT[k];

        const form =
            $(`#form-${k}`);

        if (!form) return;

        form.reset();

        ui[k].editId =
            null;


        for (
            const campo
            of e.campos
        ) {

            if (
                campo.defecto
            ) {

                form.elements[
                    campo.k
                ].value =
                    campo.defecto();
            }
        }


        mensaje(
            form,
            ''
        );

        estadoFormulario(
            k
        );
    }


    /* =====================================================
       ESTADO DEL FORMULARIO
       ===================================================== */

    function estadoFormulario(k) {

        const e =
            ENT[k];

        const editando =
            !!ui[k].editId;

        const vista =
            $(`#vista-${k}`);

        if (!vista) return;


        const titulo =
            $('[data-form-titulo]', vista);

        const guardarBtn =
            $('[data-guardar]', vista);

        const limpiarBtn =
            $('[data-limpiar]', vista);

        const panel =
            $(`#panel-${k}`);


        if (titulo) {

            titulo.textContent =
                `${editando
                    ? 'Editar'
                    : 'Registrar'
                } ${e.singular}`;
        }


        if (guardarBtn) {

            guardarBtn.textContent =
                `${editando
                    ? 'Actualizar'
                    : 'Guardar'
                } ${e.singular}`;
        }


        if (limpiarBtn) {

            limpiarBtn.textContent =
                editando
                    ? 'Cancelar edición'
                    : 'Limpiar';
        }


        if (panel) {

            panel.classList.toggle(
                'editando',
                editando
            );
        }
    }


    /* =====================================================
       PINTAR TABLA
       ===================================================== */

    function pintarTabla(k) {

        const e =
            ENT[k];

        const tabla =
            $(`#${e.tabla}`);

        if (!tabla) return;


        const busqueda =
            String(
                ui[k].q || ''
            )
            .toLowerCase()
            .trim();


        let registros =
            [...db[k]];


        if (busqueda) {

            registros =
                registros.filter(
                    registro =>
                        JSON.stringify(
                            registro
                        )
                        .toLowerCase()
                        .includes(
                            busqueda
                        )
                );
        }


        const thead =
            $('thead', tabla);

        const tbody =
            $('tbody', tabla);


        thead.innerHTML = `
            <tr>
                ${e.columnas
                    .map(
                        columna =>
                            `<th class="${
                                columna.n
                                    ? 'num'
                                    : ''
                            }">
                                ${esc(
                                    columna.t
                                )}
                             </th>`
                    )
                    .join('')}

                <th class="acciones">
                    Acciones
                </th>
            </tr>
        `;


        tbody.innerHTML =
            registros.length

                ? registros
                    .map(
                        registro => `

                        <tr class="${
                            ui[k].editId &&
                            Number(
                                ui[k].editId
                            ) ===
                            Number(
                                registro[
                                    `id_${k === 'clientes'
                                        ? 'cliente'
                                        : k === 'productos'
                                            ? 'producto'
                                            : k === 'pedidos'
                                                ? 'pedido'
                                                : k === 'detalles'
                                                    ? 'detalle'
                                                    : 'pago'}`
                                ]
                            )
                                ? 'editando'
                                : ''
                        }">

                            ${e.columnas
                                .map(
                                    columna =>
                                        `<td class="${
                                            columna.n
                                                ? 'num'
                                                : ''
                                        }">
                                            ${
                                                columna.r(
                                                    registro
                                                )
                                            }
                                         </td>`
                                )
                                .join('')}


                            <td class="acciones">

                                <button
                                    class="boton-secundario"
                                    type="button"
                                    data-accion="editar"
                                    data-ent="${k}"
                                    data-id="${getId(
                                        k,
                                        registro
                                    )}">

                                    Editar

                                </button>


                                <button
                                    class="boton-secundario"
                                    type="button"
                                    data-accion="eliminar"
                                    data-ent="${k}"
                                    data-id="${getId(
                                        k,
                                        registro
                                    )}">

                                    Eliminar

                                </button>

                            </td>

                        </tr>
                    `
                    )
                    .join('')

                : `
                    <tr>
                        <td
                            class="vacio"
                            colspan="${
                                e.columnas.length + 1
                            }">

                            Sin datos todavía.

                        </td>
                    </tr>
                `;


        const contador =
            $(
                '[data-contador]',
                $(`#vista-${k}`)
            );

        if (contador) {

            contador.textContent =
                `${registros.length}
                 ${
                    registros.length === 1
                        ? 'registro'
                        : 'registros'
                 }`;
        }
    }


    /* =====================================================
       OBTENER ID DE CUALQUIER ENTIDAD
       ===================================================== */

    function getId(k, registro) {

        switch (k) {

            case 'clientes':
                return registro.id_cliente;

            case 'productos':
                return registro.id_producto;

            case 'pedidos':
                return registro.id_pedido;

            case 'detalles':
                return registro.id_detalle;

            case 'pagos':
                return registro.id_pago;

            default:
                return null;
        }
    }


    /* =====================================================
       VALIDACIÓN
       ===================================================== */

    function validar(
        e,
        datos,
        id
    ) {

        for (
            const campo
            of e.campos
        ) {

            const valor =
                datos[campo.k];


            if (
                campo.req &&
                (
                    valor === null ||
                    valor === '' ||
                    valor === undefined
                )
            ) {

                return `El campo «${campo.l}» es obligatorio.`;
            }


            if (
                campo.t ===
                'number' &&
                valor !== null
            ) {

                if (
                    !Number.isFinite(
                        Number(valor)
                    )
                ) {

                    return `«${campo.l}» debe ser un número válido.`;
                }


                if (
                    campo.min !== undefined &&
                    Number(valor) <
                    campo.min
                ) {

                    return `«${campo.l}» debe ser mayor o igual a ${campo.min}.`;
                }


                if (
                    campo.entero &&
                    !Number.isInteger(
                        Number(valor)
                    )
                ) {

                    return `«${campo.l}» debe ser un número entero.`;
                }
            }


            if (
                campo.t === 'email' &&
                valor &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(valor)
            ) {

                return 'Ingresa un correo electrónico válido.';
            }
        }


        return e.valida
            ? e.valida(
                datos,
                id
            )
            : null;
    }


    /* =====================================================
       PREPARAR DATOS PARA BACKEND
       ===================================================== */

    function prepararPayload(
        k,
        datos
    ) {

        switch (k) {

            case 'clientes':

                return {
                    id_cliente:
                        ui[k].editId
                            ? Number(
                                ui[k].editId
                            )
                            : null,

                    nombre:
                        datos.nombre,

                    documento:
                        datos.documento,

                    telefono:
                        datos.telefono,

                    correo:
                        datos.correo,

                    direccion:
                        datos.direccion,

                    ciudad:
                        datos.ciudad,

                    tipo_cliente:
                        datos.tipo_cliente
                };


            case 'productos':

                return {
                    id_producto:
                        ui[k].editId
                            ? Number(
                                ui[k].editId
                            )
                            : null,

                    nombre:
                        datos.nombre,

                    tipo:
                        datos.tipo,

                    variedad:
                        datos.variedad,

                    descripcion:
                        datos.descripcion,

                    precio:
                        Number(
                            datos.precio
                        ),

                    unidad_medida:
                        datos.unidad_medida,

                    stock:
                        Number(
                            datos.stock
                        ),

                    imagen:
                        datos.imagen,

                    activo:
                        datos.activo === true ||
                        datos.activo === 'true'
                };


            case 'pedidos':

                return {
                    id_pedido:
                        ui[k].editId
                            ? Number(
                                ui[k].editId
                            )
                            : null,

                    id_cliente:
                        Number(
                            datos.id_cliente
                        ),

                    id_usuario:
                        obtenerUsuarioActual()
                            ?.id_usuario ||
                        null,

                    fecha:
                        datos.fecha,

                    estado:
                        datos.estado,

                    total:
                        totalPedido(
                            ui[k].editId
                                ? ui[k].editId
                                : 0
                        ),

                    observaciones:
                        datos.observaciones
                };


            case 'detalles':

                return {
                    id_detalle:
                        ui[k].editId
                            ? Number(
                                ui[k].editId
                            )
                            : null,

                    id_pedido:
                        Number(
                            datos.id_pedido
                        ),

                    id_producto:
                        Number(
                            datos.id_producto
                        ),

                    cantidad:
                        Number(
                            datos.cantidad
                        ),

                    precio:
                        Number(
                            datos.precio
                        )
                };


            case 'pagos':

                return {
                    id_pago:
                        ui[k].editId
                            ? Number(
                                ui[k].editId
                            )
                            : null,

                    id_pedido:
                        Number(
                            datos.id_pedido
                        ),

                    monto:
                        Number(
                            datos.monto
                        ),

                    metodo:
                        datos.metodo,

                    estado:
                        datos.estado,

                    fecha:
                        datos.fecha
                };


            default:

                return datos;
        }
    }


    /* =====================================================
       GUARDAR REGISTRO EN SPRING BOOT
       ===================================================== */

    async function guardarRegistro(
        k,
        form
    ) {

        const e =
            ENT[k];

        const estado =
            ui[k];

        const datos = {};


        for (
            const campo
            of e.campos
        ) {

            let valor =
                form.elements[
                    campo.k
                ].value;


            if (
                campo.t !==
                'textarea'
            ) {

                valor =
                    valor.trim();
            }


            if (
                campo.t ===
                'number'
            ) {

                valor =
                    valor === ''
                        ? null
                        : Number(valor);
            }


            if (
                campo.k ===
                'activo'
            ) {

                valor =
                    valor === 'true';
            }


            datos[campo.k] =
                valor;
        }


        const error =
            validar(
                e,
                datos,
                estado.editId
            );


        if (error) {

            mensaje(
                form,
                error,
                'error'
            );

            return;
        }


        const editando =
            !!estado.editId;


        const payload =
            prepararPayload(
                k,
                datos
            );


        try {

            const url =
                editando
                    ? `${API[k]}/${estado.editId}`
                    : API[k];


            const metodo =
                editando
                    ? 'PUT'
                    : 'POST';


            await apiFetch(
                url,
                {
                    method: metodo,

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


            await cargarDatos();

            resetForm(k);

            toast(
                `${cap(
                    e.singular
                )} ${
                    editando
                        ? 'actualizado'
                        : 'registrado'
                } correctamente.`
            );


        } catch (error) {

            console.error(
                `Error guardando ${k}:`,
                error
            );

            mensaje(
                form,
                error.message,
                'error'
            );

            toast(
                `No se pudo guardar: ${error.message}`,
                'error'
            );
        }
    }


    /* =====================================================
       EDITAR
       ===================================================== */

    function editar(
        k,
        id
    ) {

        const e =
            ENT[k];

        const form =
            $(`#form-${k}`);

        if (!form) return;


        const registro =
            obtenerRegistro(
                k,
                id
            );

        if (!registro) {

            toast(
                'No se encontró el registro.',
                'error'
            );

            return;
        }


        ui[k].editId =
            Number(id);


        llenarSelects();


        for (
            const campo
            of e.campos
        ) {

            const control =
                form.elements[
                    campo.k
                ];

            if (!control) continue;


            let valor =
                registro[
                    campo.k
                ];


            if (
                campo.k ===
                'activo'
            ) {

                valor =
                    String(
                        !!valor
                    );
            }


            control.value =
                valor ?? '';
        }


        mensaje(
            form,
            ''
        );


        estadoFormulario(
            k
        );


        pintarTabla(
            k
        );


        const panel =
            $(`#panel-${k}`);

        if (panel) {

            panel.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }


        const primerCampo =
            e.campos[0];

        if (
            form.elements[
                primerCampo.k
            ]
        ) {

            form.elements[
                primerCampo.k
            ].focus({
                preventScroll: true
            });
        }
    }


    function obtenerRegistro(
        k,
        id
    ) {

        switch (k) {

            case 'clientes':
                return porIdCliente(id);

            case 'productos':
                return porIdProducto(id);

            case 'pedidos':
                return porIdPedido(id);

            case 'detalles':
                return porIdDetalle(id);

            case 'pagos':
                return porIdPago(id);

            default:
                return null;
        }
    }


    /* =====================================================
       ELIMINAR
       ===================================================== */

    async function eliminar(
        k,
        id
    ) {

        const e =
            ENT[k];

        const registro =
            obtenerRegistro(
                k,
                id
            );

        if (!registro) return;


        if (
            k === 'productos'
        ) {

            const usados =
                db.detalles.filter(
                    d =>
                        Number(
                            d.id_producto
                        ) ===
                        Number(id)
                );

            if (usados.length) {

                toast(
                    `No se puede eliminar: el producto aparece en ${usados.length} detalle(s) de pedido.`,
                    'error'
                );

                return;
            }
        }


        if (
            k === 'clientes'
        ) {

            const usados =
                db.pedidos.filter(
                    p =>
                        Number(
                            p.id_cliente
                        ) ===
                        Number(id)
                );

            if (usados.length) {

                toast(
                    `No se puede eliminar: el cliente tiene ${usados.length} pedido(s) asociado(s).`,
                    'error'
                );

                return;
            }
        }


        if (
            k === 'pedidos'
        ) {

            const detalles =
                db.detalles.filter(
                    d =>
                        Number(
                            d.id_pedido
                        ) ===
                        Number(id)
                );

            const pagos =
                db.pagos.filter(
                    p =>
                        Number(
                            p.id_pedido
                        ) ===
                        Number(id)
                );

            if (
                !confirm(
                    `¿Eliminar este pedido?\n\nTambién se eliminarán sus ${detalles.length} detalle(s) y ${pagos.length} pago(s) asociados.`
                )
            ) {

                return;
            }

        } else {

            if (
                !confirm(
                    `¿Eliminar este ${e.singular}? Esta acción no se puede deshacer.`
                )
            ) {

                return;
            }
        }


        try {

            await apiFetch(
                `${API[k]}/${id}`,
                {
                    method: 'DELETE'
                }
            );


            await cargarDatos();


            if (
                ui[k].editId &&
                Number(
                    ui[k].editId
                ) === Number(id)
            ) {

                resetForm(k);
            }


            toast(
                `${cap(
                    e.singular
                )} eliminado correctamente.`
            );


        } catch (error) {

            console.error(
                'Error eliminando:',
                error
            );

            toast(
                `No se pudo eliminar: ${error.message}`,
                'error'
            );
        }
    }


    /* =====================================================
       DASHBOARD
       ===================================================== */

    function pintarResumen() {

        const clientes =
            db.clientes.length;

        const productos =
            db.productos.length;

        const pedidos =
            db.pedidos.length;

        const pedidosActivos =
            db.pedidos.filter(
                p =>
                    String(
                        p.estado || ''
                    ).toUpperCase() !==
                    'CANCELADO'
            );


        const ingresos =
            db.pagos
                .filter(
                    p =>
                        String(
                            p.estado || ''
                        ).toUpperCase() ===
                        'PAGADO'
                )
                .reduce(
                    (s, p) =>
                        s +
                        Number(
                            p.monto || 0
                        ),
                    0
                );


        const kpiClientes =
            $('#kpiClientes');

        const kpiProductos =
            $('#kpiProductos');

        const kpiPedidos =
            $('#kpiPedidos');

        const kpiIngresos =
            $('#kpiIngresos');


        if (kpiClientes)
            kpiClientes.textContent =
                entero.format(
                    clientes
                );

        if (kpiProductos)
            kpiProductos.textContent =
                entero.format(
                    productos
                );

        if (kpiPedidos)
            kpiPedidos.textContent =
                entero.format(
                    pedidos
                );

        if (kpiIngresos)
            kpiIngresos.textContent =
                moneda.format(
                    ingresos
                );


        const txtClientes =
            $('#kpiClientesTxt');

        const txtProductos =
            $('#kpiProductosTxt');

        const txtPedidos =
            $('#kpiPedidosTxt');

        const txtIngresos =
            $('#kpiIngresosTxt');


        if (txtClientes)
            txtClientes.textContent =
                `${clientes} registrado${
                    clientes === 1
                        ? ''
                        : 's'
                }`;


        const stockBajo =
            db.productos.filter(
                p =>
                    Number(
                        p.stock || 0
                    ) <= STOCK_BAJO
            ).length;


        if (txtProductos)
            txtProductos.textContent =
                stockBajo
                    ? `${stockBajo} con stock bajo`
                    : 'Stock disponible';


        if (txtPedidos)
            txtPedidos.textContent =
                `${pedidosActivos.length} activo${
                    pedidosActivos.length === 1
                        ? ''
                        : 's'
                }`;


        if (txtIngresos)
            txtIngresos.textContent =
                'Pagos confirmados';


        pintarPedidosRecientes();
    }


    function pintarPedidosRecientes() {

        const tbody =
            $('#tablaRecientes tbody');

        if (!tbody) return;


        const pedidos =
            [...db.pedidos]
                .sort(
                    (a, b) =>
                        String(
                            b.fecha || ''
                        ).localeCompare(
                            String(
                                a.fecha || ''
                            )
                        )
                )
                .slice(0, 5);


        tbody.innerHTML =
            pedidos.length

                ? pedidos.map(
                    p => `

                    <tr>

                        <td>
                            <span class="codigo">
                                PED-${String(
                                    p.id_pedido
                                ).padStart(
                                    4,
                                    '0'
                                )}
                            </span>
                        </td>

                        <td>
                            ${celda(
                                nombreCliente(
                                    p.id_cliente
                                )
                            )}
                        </td>

                        <td>
                            ${fecha(
                                p.fecha
                            )}
                        </td>

                        <td>
                            ${pill(
                                String(
                                    p.estado || ''
                                ).toLowerCase()
                            )}
                        </td>

                        <td class="num">
                            <strong>
                                ${moneda.format(
                                    totalPedido(
                                        p.id_pedido
                                    )
                                )}
                            </strong>
                        </td>

                    </tr>
                `
                ).join('')

                : `
                    <tr>
                        <td
                            class="vacio"
                            colspan="5">

                            No hay pedidos registrados.

                        </td>
                    </tr>
                `;
    }


    /* =====================================================
       INFORMES
       ===================================================== */

    function pintarInformes() {

        const vivos =
            db.pedidos.filter(
                p =>
                    String(
                        p.estado || ''
                    ).toUpperCase() !==
                    'CANCELADO'
            );


        const facturado =
            vivos.reduce(
                (s, p) =>
                    s +
                    totalPedido(
                        p.id_pedido
                    ),
                0
            );


        const cobrado =
            db.pagos
                .filter(
                    p =>
                        String(
                            p.estado || ''
                        ).toUpperCase() ===
                        'PAGADO'
                )
                .reduce(
                    (s, p) =>
                        s +
                        Number(
                            p.monto || 0
                        ),
                    0
                );


        const porCobrar =
            vivos.reduce(
                (s, p) =>
                    s +
                    saldoPedido(
                        p.id_pedido
                    ),
                0
            );


        const ticket =
            vivos.length
                ? facturado /
                  vivos.length
                : 0;


        const infCobrado =
            $('#infCobrado');

        const infPorCobrar =
            $('#infPorCobrar');

        const infTicket =
            $('#infTicket');


        if (infCobrado)
            infCobrado.textContent =
                moneda.format(
                    cobrado
                );


        if (infPorCobrar)
            infPorCobrar.textContent =
                moneda.format(
                    porCobrar
                );


        if (infTicket)
            infTicket.textContent =
                moneda.format(
                    ticket
                );


        const cobradoTxt =
            $('#infCobradoTxt');

        const porCobrarTxt =
            $('#infPorCobrarTxt');

        const ticketTxt =
            $('#infTicketTxt');


        if (cobradoTxt)
            cobradoTxt.textContent =
                `${
                    db.pagos.filter(
                        p =>
                            String(
                                p.estado || ''
                            ).toUpperCase() ===
                            'PAGADO'
                    ).length
                } pagos confirmados`;


        if (porCobrarTxt)
            porCobrarTxt.textContent =
                `${
                    vivos.filter(
                        p =>
                            saldoPedido(
                                p.id_pedido
                            ) > 0
                    ).length
                } pedidos con saldo abierto`;


        if (ticketTxt)
            ticketTxt.textContent =
                `Sobre ${
                    vivos.length
                } pedido${
                    vivos.length === 1
                        ? ''
                        : 's'
                } no cancelado${
                    vivos.length === 1
                        ? ''
                        : 's'
                }`;


        pintarVentasProducto(
            vivos
        );

        pintarEstados();

        pintarTopClientes(
            vivos
        );
    }


    function pintarVentasProducto(
        pedidos
    ) {

        const contenedor =
            $('#infProductos');

        if (!contenedor) return;


        const ids =
            new Set(
                pedidos.map(
                    p => p.id_pedido
                )
            );


        const mapa =
            new Map();


        for (
            const detalle
            of db.detalles
        ) {

            if (
                !ids.has(
                    detalle.id_pedido
                )
            ) {
                continue;
            }


            const valor =
                Number(
                    detalle.cantidad || 0
                ) *
                Number(
                    detalle.precio || 0
                );


            const anterior =
                mapa.get(
                    detalle.id_producto
                ) || 0;


            mapa.set(
                detalle.id_producto,
                anterior + valor
            );
        }


        const datos =
            [...mapa.entries()]
                .map(
                    ([id, valor]) => ({
                        nombre:
                            nombreProducto(
                                id
                            ),

                        valor
                    })
                )
                .sort(
                    (a, b) =>
                        b.valor -
                        a.valor
                )
                .slice(0, 6);


        contenedor.innerHTML =
            barras(
                datos,
                dato =>
                    moneda.format(
                        dato.valor
                    )
            );
    }


    function pintarEstados() {

        const contenedor =
            $('#infEstados');

        if (!contenedor) return;


        const datos =
            ESTADOS_PEDIDO.map(
                estado => ({
                    l: cap(
                        estado.toLowerCase()
                    ),

                    s:
                        estado.toLowerCase(),

                    v:
                        db.pedidos.filter(
                            p =>
                                String(
                                    p.estado || ''
                                ).toUpperCase() ===
                                estado
                        ).length
                })
            );


        contenedor.innerHTML =
            barras(
                datos,
                dato =>
                    entero.format(
                        dato.v
                    ),
                dato =>
                    dato.s
            );
    }


    function pintarTopClientes(
        pedidos
    ) {

        const tbody =
            $('#tablaTopClientes tbody');

        if (!tbody) return;


        const mapa =
            new Map();


        for (
            const pedido
            of pedidos
        ) {

            const id =
                pedido.id_cliente;


            const anterior =
                mapa.get(id) || {
                    pedidos: 0,
                    total: 0,
                    saldo: 0
                };


            anterior.pedidos += 1;

            anterior.total +=
                totalPedido(
                    pedido.id_pedido
                );

            anterior.saldo +=
                saldoPedido(
                    pedido.id_pedido
                );


            mapa.set(
                id,
                anterior
            );
        }


        const datos =
            [...mapa.entries()]
                .sort(
                    (a, b) =>
                        b[1].total -
                        a[1].total
                )
                .slice(0, 5);


        tbody.innerHTML =
            datos.length

                ? datos.map(
                    ([id, dato]) => `

                    <tr>

                        <td>
                            ${celda(
                                nombreCliente(
                                    id
                                ),
                                porIdCliente(
                                    id
                                )?.ciudad
                            )}
                        </td>

                        <td class="num">
                            ${dato.pedidos}
                        </td>

                        <td class="num">
                            <strong>
                                ${moneda.format(
                                    dato.total
                                )}
                            </strong>
                        </td>

                        <td
                            class="num ${
                                dato.saldo
                                    ? ''
                                    : 'saldo-cero'
                            }">

                            ${moneda.format(
                                dato.saldo
                            )}

                        </td>

                    </tr>
                `
                ).join('')

                : `
                    <tr>
                        <td
                            class="vacio"
                            colspan="4">

                            Sin datos todavía.

                        </td>
                    </tr>
                `;
    }


    /* =====================================================
       BARRAS DE INFORMES
       ===================================================== */

    function barras(
        datos,
        formatearValor,
        claseFn
    ) {

        if (!datos.length) {

            return `
                <div class="vacio">
                    Sin datos todavía.
                </div>
            `;
        }


        const max =
            Math.max(
                ...datos.map(
                    d =>
                        Number(
                            d.valor ??
                            d.v ??
                            0
                        )
                ),
                1
            );


        return datos
            .map(
                (dato, indice) => {

                    const valor =
                        Number(
                            dato.valor ??
                            dato.v ??
                            0
                        );


                    const porcentaje =
                        Math.max(
                            0,
                            Math.min(
                                100,
                                (
                                    valor /
                                    max
                                ) * 100
                            )
                        );


                    const clase =
                        claseFn
                            ? claseFn(
                                dato,
                                indice
                            )
                            : '';


                    return `
                        <div class="barra-fila">

                            <div class="barra-info">

                                <span>
                                    ${esc(
                                        dato.l ??
                                        dato.nombre ??
                                        ''
                                    )}
                                </span>

                                <strong>
                                    ${formatearValor(
                                        valor
                                    )}
                                </strong>

                            </div>


                            <div
                                class="barra ${
                                    clase || ''
                                }">

                                <i
                                    style="width:${porcentaje}%">
                                </i>

                            </div>

                        </div>
                    `;
                }
            )
            .join('');
    }


    /* =====================================================
       REFRESCAR TODO
       ===================================================== */

    function refrescar() {

        llenarSelects();


        Object.keys(
            ENT
        ).forEach(
            pintarTabla
        );


        pintarResumen();

        pintarInformes();
    }


    /* =====================================================
       NAVEGACIÓN
       ===================================================== */

    const VISTAS = [
        'dashboard',
        'clientes',
        'productos',
        'pedidos',
        'detalles',
        'pagos',
        'informes'
    ];


    const TITULOS = {

        dashboard:
            'Resumen',

        clientes:
            'Clientes',

        productos:
            'Productos',

        pedidos:
            'Pedidos',

        detalles:
            'Detalle de pedidos',

        pagos:
            'Pagos',

        informes:
            'Informes'
    };


    function ir(
        nombre,
        {
            actualizarHash = true
        } = {}
    ) {

        if (
            !VISTAS.includes(
                nombre
            )
        ) {

            nombre =
                'dashboard';
        }


        $$('.vista')
            .forEach(
                vista => {

                    vista.hidden =
                        vista.id !==
                        `vista-${nombre}`;
                }
            );


        $$('.sidebar button[data-ir]')
            .forEach(
                boton => {

                    const activo =
                        boton.dataset.ir ===
                        nombre;

                    boton.classList.toggle(
                        'activo',
                        activo
                    );


                    if (activo) {

                        boton.setAttribute(
                            'aria-current',
                            'page'
                        );

                    } else {

                        boton.removeAttribute(
                            'aria-current'
                        );
                    }
                }
            );


        document.title =
            `${TITULOS[nombre]} · Gestión Comercial`;


        if (
            actualizarHash &&
            location.hash !==
            `#${nombre}`
        ) {

            history.replaceState(
                null,
                '',
                `#${nombre}`
            );
        }


        window.scrollTo({
            top: 0
        });
    }


    /* =====================================================
       EVENTOS DE CLICK
       ===================================================== */

    document.addEventListener(
        'click',
        async (evento) => {

            const objetivo =
                evento.target.closest(
                    'button, [data-ir], [data-nuevo]'
                );


            if (!objetivo) {
                return;
            }


            if (
                objetivo.dataset.accion ===
                'editar'
            ) {

                editar(
                    objetivo.dataset.ent,
                    objetivo.dataset.id
                );

                return;
            }


            if (
                objetivo.dataset.accion ===
                'eliminar'
            ) {

                await eliminar(
                    objetivo.dataset.ent,
                    objetivo.dataset.id
                );

                return;
            }


            if (
                objetivo.dataset.limpiar
            ) {

                const k =
                    objetivo.dataset.limpiar;

                resetForm(k);

                pintarTabla(k);

                return;
            }


            if (
                objetivo.dataset.nuevo
            ) {

                const k =
                    objetivo.dataset.nuevo;

                ir(k);

                resetForm(k);

                pintarTabla(k);

                const form =
                    $(`#form-${k}`);

                if (
                    form &&
                    ENT[k].campos[0]
                ) {

                    form.elements[
                        ENT[k].campos[0].k
                    ].focus();
                }

                return;
            }


            if (
                objetivo.dataset.ir
            ) {

                ir(
                    objetivo.dataset.ir
                );
            }
        }
    );


    /* =====================================================
       TECLADO
       ===================================================== */

    document.addEventListener(
        'keydown',
        evento => {

            if (
                (
                    evento.key ===
                    'Enter' ||
                    evento.key ===
                    ' '
                ) &&
                evento.target.matches(
                    '.operacion-item[data-ir]'
                )
            ) {

                evento.preventDefault();

                ir(
                    evento.target.dataset.ir
                );
            }
        }
    );


    /* =====================================================
       BÚSQUEDA
       ===================================================== */

    document.addEventListener(
        'input',
        evento => {

            const buscar =
                evento.target.closest(
                    '[data-buscar]'
                );


            if (buscar) {

                const k =
                    buscar.dataset.buscar;

                ui[k].q =
                    buscar.value;

                pintarTabla(k);

                return;
            }


            const form =
                evento.target.closest(
                    'form[data-ent]'
                );


            if (form) {

                mensaje(
                    form,
                    ''
                );
            }
        }
    );


    /* =====================================================
       CAMBIOS EN SELECTS
       ===================================================== */

    document.addEventListener(
        'change',
        evento => {

            const form =
                evento.target.closest(
                    'form[data-ent]'
                );


            if (!form) return;


            mensaje(
                form,
                ''
            );
        }
    );


    /* =====================================================
       SUBMIT
       ===================================================== */

    document.addEventListener(
        'submit',
        async evento => {

            const form =
                evento.target.closest(
                    'form[data-ent]'
                );


            if (!form) {
                return;
            }


            evento.preventDefault();


            await guardarRegistro(
                form.dataset.ent,
                form
            );
        }
    );


    /* =====================================================
       BOTÓN DE ACTUALIZAR INFORMES
       ===================================================== */

    const btnRestablecer =
        $('#btnRestablecer');


    if (btnRestablecer) {

        btnRestablecer.textContent =
            'Actualizar datos';


        btnRestablecer.addEventListener(
            'click',
            async () => {

                await cargarDatos();

                toast(
                    'Datos actualizados desde H2.'
                );
            }
        );
    }


    /* =====================================================
       HASH
       ===================================================== */

    window.addEventListener(
        'hashchange',
        () =>
            ir(
                location.hash.slice(1),
                {
                    actualizarHash:
                        false
                }
            )
    );


    /* =====================================================
       FECHA DEL DASHBOARD
       ===================================================== */

    function colocarFecha() {

        const elemento =
            $('#fechaHoy');

        if (!elemento) {
            return;
        }


        const texto =
            new Date()
                .toLocaleDateString(
                    'es-CO',
                    {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }
                );


        elemento.textContent =
            cap(texto);
    }


    /* =====================================================
       INICIO
       ===================================================== */

    async function iniciar() {

        Object.keys(
            ENT
        ).forEach(
            montarVista
        );


        mostrarUsuarioActual();

        colocarFecha();

        llenarSelects();


        Object.keys(
            ENT
        ).forEach(
            resetForm
        );


        ir(
            location.hash.slice(1) ||
            'dashboard',
            {
                actualizarHash:
                    false
            }
        );


        await cargarDatos();
    }


    iniciar();

})();