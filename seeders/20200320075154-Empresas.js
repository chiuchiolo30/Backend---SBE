
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
    */

      return queryInterface.bulkInsert('empresas', [{
          id:'1',
          nombre:'Peugeot Citroen Argentina S.A.',
          direccion:'algo',
          cuit:'12548',
          cod_empresa:'321'       
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
    */

      return queryInterface.bulkDelete('empresas', null, {});
  }
};
