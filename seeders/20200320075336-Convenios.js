
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
    */

      return queryInterface.bulkInsert('convenios', [{
          id: 1,
          nombre:'ramon',
          fec_inicio:'2020-11-02',
          fec_fin:'2020-11-02',
          num_acuerdo:'545',
          num_expediente:'454',
          tipo_convenio:'asdasd',
          id_personales: 1
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
    */

      return queryInterface.bulkDelete('convenios', null, {});
  }
};
