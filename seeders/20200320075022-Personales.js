
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
    */

      return queryInterface.bulkInsert('personales', [{
          id: 1,
          apellido:'Sánchez de Boeck',
          nombre:'Antonio',
          dni:'11222333',
          direccion:'asdasd',
          email:'asdasd',
          telefono:'asdasd'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
    */

      return queryInterface.bulkDelete('personales', null, {});
  }
};
