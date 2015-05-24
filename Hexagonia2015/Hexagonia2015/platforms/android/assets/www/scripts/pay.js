//var pay = {
//    pay: function () {
//        var result = checkout.createCryptogramPacket();

//        if (result.success) {
//            // сформирована криптограмма
//            alert(result.packet);
//        }
//        else {
//            // найдены ошибки в ведённых данных, объект `result.messages` формата:
//            // { name: "В имени держателя карты слишком много символов", cardNumber: "Неправильный номер карты" }
//            // где `name`, `cardNumber` соответствуют значениям атрибутов `<input ... data-cp="cardNumber">`
//            for (var msgName in viewModel.messages) {
//                viewModel.messages[msgName](result.messages[msgName]);
//            }
//        }
//    },
//    pay_widget : function () {
//        var widget = new cp.CloudPayments();
//        widget.charge({ // options
//            publicId: 'test_api_00000000000000000000001', 
//            description: 'Пример оплаты (деньги сниматься не будут)', //назначение
//            amount: 10, //сумма
//            currency: 'RUB', //валюта
//            invoiceId: '1234567', //номер заказа  (небязательно)
//            accountId: 'user@example.com', //идентификатор плательщика (небязательно)
//            data: {
//                myProp: 'myProp value' //произвольный набор параметров
//            }
//        },
//            function (options) { // success
//                alert('оплата прошла');
//                //действие при успешной оплате
//            },
//            function (reason, options) { // fail
//                alert('оплата v svizde');
//                //действие при неуспешной оплате
//            });
//    },
//}

//var checkout = new cp.Checkout("test_api_00000000000000000000001", document.getElementById("paymentFormSample"));