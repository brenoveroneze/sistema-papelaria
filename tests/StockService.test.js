jest.mock('../src/database/db', () => ({
    // Retornamos um objeto vazio ou com funções falsas para isolar o banco
    run: jest.fn(),
    all: jest.fn(),
    get: jest.fn()
}));

jest.mock('../src/repositories/ProductRepository');

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn()
    }
}));

// 2. IMPORTS VÊM DEPOIS!
// Agora é seguro importar os serviços, pois as dependências já estão mockadas.
const StockService = require('../src/services/StockService');
const ProductRepository = require('../src/repositories/ProductRepository');
const crypto = require('crypto');
const fs = require('fs').promises;

describe('StockService', () => {
    
    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    describe('findProductSafe', () => {
        it('deve buscar um produto pelo nome usando o repositório', async () => {
            const mockRows = [{ id: 1, name: 'Caderno 10 Matérias', price: 25.50 }];
            ProductRepository.findByName.mockResolvedValue(mockRows);

            const result = await StockService.findProductSafe('Caderno 10 Matérias');
            
            expect(ProductRepository.findByName).toHaveBeenCalledWith('Caderno 10 Matérias');
            expect(result).toEqual(mockRows);
        });

        it('deve lançar um erro se o input fornecido for inválido', async () => {
            await expect(StockService.findProductSafe(null)).rejects.toThrow("Input inválido");
            await expect(StockService.findProductSafe(123)).rejects.toThrow("Input inválido");
        });
    });

    describe('generateSystemReport', () => {
        it('deve ler e retornar o conteúdo do arquivo com segurança', async () => {
            const fakeContent = "Relatório de Vendas do Mês";
            fs.readFile.mockResolvedValue(fakeContent);

            const result = await StockService.generateSystemReport('vendas.txt');
            
            expect(fs.readFile).toHaveBeenCalled();
            expect(result).toBe(fakeContent);
        });

        it('deve lançar um erro caso o arquivo não seja encontrado ou não possa ser lido', async () => {
           
            fs.readFile.mockRejectedValue(new Error('ENOENT: no such file or directory'));
            
            
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

           
            await expect(StockService.generateSystemReport('inexistente.txt'))
                .rejects.toThrow('ENOENT: no such file or directory');

          
            expect(consoleSpy).toHaveBeenCalled();

         
            consoleSpy.mockRestore();
        });
    });

    describe('hashData', () => {
        it('deve retornar um hash SHA-256 corretamente', () => {
            const input = "senha_super_secreta";
            const expectedHash = crypto.createHash('sha256').update(input).digest("hex");
            
            const result = StockService.hashData(input);
            
            expect(result).toBe(expectedHash);
        });
    });

    describe('createProduct', () => {
        it('deve criar e retornar o produto quando dados válidos forem informados', async () => {
            const inputData = { name: 'Borracha', price: 1.50 };
            const expectedReturn = { id: 2, ...inputData };
            
            ProductRepository.create.mockResolvedValue(expectedReturn);

            const result = await StockService.createProduct(inputData);
            
            expect(ProductRepository.create).toHaveBeenCalledWith(inputData);
            expect(result).toEqual(expectedReturn);
        });

        it('deve retornar null se o nome do produto não for fornecido', async () => {
            const result = await StockService.createProduct({ price: 1.50 });
            expect(result).toBeNull();
            expect(ProductRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('sellProduct', () => {
        it('deve retornar true ao processar a venda', async () => {
            const result = await StockService.sellProduct(1, 5);
            expect(result).toBe(true);
        });
    });
});