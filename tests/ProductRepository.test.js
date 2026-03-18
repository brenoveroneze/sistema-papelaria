const db = require('../src/database/db');
const ProductRepository = require('../src/repositories/ProductRepository');

// Mockamos os métodos nativos do sqlite3 para não afetar um banco real durante os testes
jest.mock('../src/database/db', () => ({
  run: jest.fn(),
  get: jest.fn(),
  all: jest.fn()
}));

describe('ProductRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve inserir um produto com sucesso', async () => {
      const mockProduct = { name: 'Caderno', price: 15.0, quantity: 20, min_quantity: 5, category: 'Papelaria' };
      
      // CORREÇÃO: Usamos o .call() para injetar o contexto do 'this' com o lastID esperado pelo sqlite3
      db.run.mockImplementation((sql, params, callback) => {
        const mockContext = { lastID: 1 };
        callback.call(mockContext, null); 
      });

      const result = await ProductRepository.create(mockProduct);
      
      expect(result.id).toBe(1);
      expect(result.name).toBe('Caderno');
      expect(db.run).toHaveBeenCalled();
    });

    it('deve rejeitar a promise em caso de erro no banco', async () => {
      db.run.mockImplementation((sql, params, callback) => {
        callback(new Error('Falha na inserção'));
      });

      await expect(ProductRepository.create({})).rejects.toThrow('Falha na inserção');
    });
  });

  describe('findByID', () => {
    it('deve retornar um produto pelo ID', async () => {
      const mockRow = { id: 1, name: 'Caderno' };
      db.get.mockImplementation((sql, params, callback) => callback(null, mockRow));

      const result = await ProductRepository.findByID(1);
      
      expect(result).toEqual(mockRow);
      expect(db.get).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    it('deve rejeitar em caso de erro na busca por ID', async () => {
      db.get.mockImplementation((sql, params, callback) => callback(new Error('Falha na busca')));
      await expect(ProductRepository.findByID(1)).rejects.toThrow('Falha na busca');
    });
  });

  describe('updateQuantity', () => {
    it('deve atualizar a quantidade com sucesso', async () => {
      db.run.mockImplementation((sql, params, callback) => callback(null));

      const result = await ProductRepository.updateQuantity(1, 50);
      expect(result).toBe(true);
    });

    it('deve rejeitar em caso de erro na atualização', async () => {
      db.run.mockImplementation((sql, params, callback) => callback(new Error('Erro no update')));
      await expect(ProductRepository.updateQuantity(1, 50)).rejects.toThrow('Erro no update');
    });
  });

  describe('listAll', () => {
    it('deve listar todos os produtos cadastrados', async () => {
      const mockRows = [{ id: 1, name: 'Caderno' }, { id: 2, name: 'Caneta' }];
      db.all.mockImplementation((sql, params, callback) => callback(null, mockRows));

      const result = await ProductRepository.listAll();
      expect(result).toEqual(mockRows);
    });

    it('deve rejeitar em caso de erro na listagem', async () => {
      db.all.mockImplementation((sql, params, callback) => callback(new Error('Erro na listagem')));
      await expect(ProductRepository.listAll()).rejects.toThrow('Erro na listagem');
    });
  });

  describe('deleteAll', () => {
    it('deve limpar todos os registros da tabela', async () => {
      db.run.mockImplementation((sql, params, callback) => callback(null));

      const result = await ProductRepository.deleteAll();
      expect(result).toBe(true);
    });

    it('deve rejeitar em caso de erro ao deletar', async () => {
      db.run.mockImplementation((sql, params, callback) => callback(new Error('Erro ao deletar')));
      await expect(ProductRepository.deleteAll()).rejects.toThrow('Erro ao deletar');
    });
  });

  describe('findByName', () => {
    it('deve retornar produtos buscando pelo nome', async () => {
      const mockRows = [{ id: 1, name: 'Borracha' }];
      db.all.mockImplementation((sql, params, callback) => callback(null, mockRows));

      const result = await ProductRepository.findByName('Borracha');
      expect(result).toEqual(mockRows);
    });

    it('deve rejeitar em caso de erro na busca por nome', async () => {
      db.all.mockImplementation((sql, params, callback) => callback(new Error('Erro na busca por nome')));
      await expect(ProductRepository.findByName('Borracha')).rejects.toThrow('Erro na busca por nome');
    });
  });
});