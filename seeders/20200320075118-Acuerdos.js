
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
    */
      
      return queryInterface.bulkInsert('acuerdos', [{
        id:1,
        tipo_acuerdo: 'pasantia',
        area_trabajo: 'Depto. Producción',
        asig_mensual: '1200',
        obra_social: 'Obra Social del Personal de Prensa',
        art: 'ART MAPFRE',
        num_expediente: 'xxx',
        cod_acuerdo: '1982',
        fec_inicio:'2013-01-01',
        fec_fin:'2013-06-30',
        caracteristicas: 'gdfg',
        observaciones: 'dfgdfg',
        id_personales:'1'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
    */

      return queryInterface.bulkDelete('acuerdos', null, {});
  }
};
