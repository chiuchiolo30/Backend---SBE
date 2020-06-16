
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
    */

      return queryInterface.bulkInsert('alumnos', [{
          
          id:'869',
          nombre:'paula',
          dni:'35523720',
          direccion:'Quintana 460 - YB',
          email:'',
          telefono:'',
          carrera:'Ingeniería Industrial',
          libreta:'CX09-0022-2',
          id_acuerdo:1          
          }],
          {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
    */

      return queryInterface.bulkDelete('alumnos', null, {});
  }
};
