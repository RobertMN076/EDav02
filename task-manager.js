// =============== 1. Implementação da HashTable (VERSÃO CORRIGIDA) ===============
// Esta versão é compatível com ambientes JavaScript mais antigos
// e não causa o erro de compilação.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var HashTable = /** @class */ (function () {
    function HashTable() {
        this.storage = {};
    }
    HashTable.prototype.set = function (key, value) {
        this.storage[key] = value;
    };
    HashTable.prototype.get = function (key) {
        return this.storage.hasOwnProperty(key) ? this.storage[key] : undefined;
    };
    HashTable.prototype.delete = function (key) {
        if (this.storage.hasOwnProperty(key)) {
            delete this.storage[key];
            return true;
        }
        return false;
    };
    /**
     * Retorna todos os valores armazenados na HashTable.
     * (Reescrito para não usar Object.values)
     */
    HashTable.prototype.getAllValues = function () {
        var values = [];
        // Itera sobre as chaves do objeto de forma segura
        for (var key in this.storage) {
            if (this.storage.hasOwnProperty(key)) {
                values.push(this.storage[key]);
            }
        }
        return values;
    };
    HashTable.prototype.clear = function () {
        this.storage = {};
    };
    HashTable.prototype.loadData = function (data) {
        this.clear();
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var _a = data_1[_i], key = _a[0], value = _a[1];
            var taskValue = value;
            if (taskValue.dateTime) {
                this.set(key, __assign(__assign({}, taskValue), { dateTime: new Date(taskValue.dateTime) }));
            }
            else {
                this.set(key, value);
            }
        }
    };
    /**
     * Retorna os dados como um array de pares [chave, valor].
     * (Reescrito para não usar Object.entries)
     */
    HashTable.prototype.toArray = function () {
        var entries = [];
        // Itera sobre as chaves do objeto de forma segura
        for (var key in this.storage) {
            if (this.storage.hasOwnProperty(key)) {
                entries.push([key, this.storage[key]]);
            }
        }
        return entries;
    };
    return HashTable;
}());
// =============== 3. Classe Gerenciadora de Tarefas ===============
// Esta classe agora usa nossa implementação de HashTable.
var TaskManager = /** @class */ (function () {
    function TaskManager(storageKey) {
        if (storageKey === void 0) { storageKey = 'myTasksWithHashTable'; }
        this.storageKey = storageKey;
        this.tasks = new HashTable();
        this.loadFromLocalStorage();
    }
    // Adiciona uma nova tarefa
    TaskManager.prototype.addTask = function (description, dateTime) {
        var id = "task_".concat(Date.now());
        var newTask = { id: id, description: description, dateTime: dateTime };
        this.tasks.set(id, newTask);
        this.saveToLocalStorage();
        return newTask;
    };
    // Busca uma tarefa pelo ID
    TaskManager.prototype.getTask = function (id) {
        return this.tasks.get(id);
    };
    // Retorna todas as tarefas, ordenadas por data
    TaskManager.prototype.listAllTasks = function () {
        return this.tasks.getAllValues().sort(function (a, b) { return a.dateTime.getTime() - b.dateTime.getTime(); });
    };
    // Exclui uma tarefa pelo ID
    TaskManager.prototype.deleteTask = function (id) {
        var deleted = this.tasks.delete(id);
        if (deleted) {
            this.saveToLocalStorage();
        }
        return deleted;
    };
    // Salva a HashTable no localStorage
    TaskManager.prototype.saveToLocalStorage = function () {
        try {
            // Usamos o método toArray() para converter os dados para um formato serializável
            var dataToStore = this.tasks.toArray();
            localStorage.setItem(this.storageKey, JSON.stringify(dataToStore));
        }
        catch (error) {
            console.error("Erro ao salvar tarefas no localStorage:", error);
        }
    };
    // Carrega as tarefas do localStorage para a HashTable
    TaskManager.prototype.loadFromLocalStorage = function () {
        try {
            var data = localStorage.getItem(this.storageKey);
            if (data) {
                var parsedData = JSON.parse(data);
                // Usamos o método loadData() para popular a HashTable
                this.tasks.loadData(parsedData);
            }
        }
        catch (error) {
            console.error("Erro ao carregar tarefas do localStorage:", error);
            this.tasks = new HashTable();
        }
    };
    return TaskManager;
}());
// =============== 4. Exemplo de Uso ===============
// --- INÍCIO DA EXECUÇÃO ---
// 1. Inicializa o gerenciador de tarefas
// Ele tentará carregar tarefas de execuções anteriores do localStorage
var taskManager = new TaskManager();
console.log("TaskManager pronto para uso.");
console.log("Tarefas carregadas do localStorage (se existirem).");
// Para fins de demonstração, vamos imprimir o que foi carregado
var initialTasks = taskManager.listAllTasks();
if (initialTasks.length > 0) {
    console.log("\n--- Tarefas já existentes ---");
    initialTasks.forEach(function (task) {
        console.log("- ".concat(task.description, " em ").concat(task.dateTime.toLocaleDateString()));
    });
}
else {
    console.log("\nNenhuma tarefa encontrada. Adicionando novas...");
    // 2. Adicionando novas tarefas (só se não houver nenhuma)
}
var taskParaDeletar = taskManager.addTask("Tarefa temporária para deletar", new Date());
// 3. Listando todas as tarefas
console.log("\n--- Lista de Todas as Tarefas (ordenadas) ---");
var allTasks = taskManager.listAllTasks();
allTasks.forEach(function (task) {
    console.log("ID: ".concat(task.id, " | Descri\u00E7\u00E3o: ").concat(task.description, " | Hor\u00E1rio: ").concat(task.dateTime.toLocaleString()));
});
// 4. Buscando uma tarefa específica
console.log("\n--- Buscando a tarefa com ID: ".concat(taskParaDeletar.id, " ---"));
var foundTask = taskManager.getTask(taskParaDeletar.id);
console.log(foundTask ? "Tarefa encontrada: ".concat(foundTask.description) : "Tarefa não encontrada.");
// 5. Excluindo a tarefa temporária
console.log("\n--- Excluindo a tarefa com ID: ".concat(taskParaDeletar.id, " ---"));
var isDeleted = taskManager.deleteTask(taskParaDeletar.id);
console.log(isDeleted ? "Tarefa excluída com sucesso!" : "Falha ao excluir tarefa.");
// 6. Listando tarefas após a exclusão
console.log("\n--- Lista Final de Tarefas ---");
var finalTasks = taskManager.listAllTasks();
finalTasks.forEach(function (task) {
    console.log("- ".concat(task.description));
});
console.log("\nExperimente recarregar a página. As tarefas persistirão no localStorage!");
